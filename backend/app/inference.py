# Inference module for document classification
# Add your model inference logic here
# backend/app/inference.py
from __future__ import annotations

from pathlib import Path
from typing import Dict, Any, List, Tuple
import io
import base64

import torch
import torch.nn.functional as F
from PIL import Image, ImageOps
import torchvision.transforms as T
import timm
import numpy as np

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image


# ---------- Paths & device ----------

ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT / "assets"

BUNDLE_PATH = ASSETS_DIR / "model_complete.pt"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ---------- Load bundle & rebuild model ----------

def _load_bundle(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Model bundle not found at {path}")
    bundle = torch.load(path, map_location=device)
    if not isinstance(bundle, dict):
        raise ValueError("Bundle must be a dict saved with torch.save({...})")
    return bundle


_bundle = _load_bundle(BUNDLE_PATH)

MODEL_NAME: str = _bundle.get("model_name", "resnet50")
NUM_CLASSES: int = int(_bundle.get("num_classes"))
IMG_SIZE: int = int(_bundle.get("img_size", 384))
LABEL_NAMES: List[str] = _bundle.get("label_names") or [
    str(i) for i in range(NUM_CLASSES)
]

# state dict key can have different names depending on how you saved it
_state_dict = (
    _bundle.get("model_state_dict")
    or _bundle.get("model_state")
    or _bundle.get("state_dict")
)
if _state_dict is None:
    raise KeyError("No state dict found in model bundle")

model = timm.create_model(
    MODEL_NAME,
    pretrained=False,
    num_classes=NUM_CLASSES,
)
model.load_state_dict(_state_dict)
model.to(device)
model.eval()


# ---------- Transforms (must match notebook eval transforms) ----------

eval_transform = T.Compose([
    T.Grayscale(num_output_channels=1),
    T.Resize((IMG_SIZE, IMG_SIZE)),
    T.ToTensor(),
    T.Normalize(mean=[0.5], std=[0.5]),
    # training pipeline did normalize on 1 channel and then repeat to 3
    lambda t: t.repeat(3, 1, 1),
])


def preprocess_image(image: Image.Image) -> torch.Tensor:
    """PIL.Image -> 1 x 3 x H x W tensor on device."""
    img = ImageOps.exif_transpose(image)  # fix orientation
    tensor = eval_transform(img).unsqueeze(0).to(device)
    return tensor


# ---------- Prediction + abstention ----------

DEFAULT_THRESHOLD = 0.7  # for "model is unsure"


def predict(
    image: Image.Image,
    threshold: float = DEFAULT_THRESHOLD,
) -> Tuple[int, str, float, bool, List[float]]:
    """
    Returns: (label_id, label_name, confidence, abstained, probabilities)
    """
    x = preprocess_image(image)

    with torch.no_grad():
        logits = model(x)
        probs = F.softmax(logits, dim=1)[0]

    conf, label_id = torch.max(probs, dim=0)
    confidence = conf.item()
    label_idx = int(label_id.item())
    abstained = confidence < threshold

    label_name = LABEL_NAMES[label_idx] if 0 <= label_idx < len(LABEL_NAMES) else str(label_idx)

    return (
        label_idx,
        label_name,
        confidence,
        abstained,
        probs.cpu().tolist(),
    )


# ---------- Grad-CAM ----------

def _get_target_layer_for_resnet(m) -> torch.nn.Module:
    """
    Works for typical ResNet-like models from timm (has .layer4).
    You can customize for other backbones if needed.
    """
    if hasattr(m, "layer4"):
        return m.layer4[-1]
    raise AttributeError("Cannot find layer4 on model for Grad-CAM")


def generate_gradcam(image: Image.Image) -> str:
    """
    Generate Grad-CAM heatmap for the given image and return as base64 PNG.
    """
    # preprocess for model
    input_tensor = preprocess_image(image)

    # prepare RGB version for visualization (0-1 float)
    rgb = image.convert("RGB").resize((IMG_SIZE, IMG_SIZE))
    rgb_np = np.array(rgb).astype(np.float32) / 255.0

    target_layer = _get_target_layer_for_resnet(model)

    cam = GradCAM(
        model=model,
        target_layers=[target_layer],
    )

    # GradCAM needs gradients enabled
    grayscale_cam = cam(input_tensor=input_tensor)[0]  # H x W

    cam_image = show_cam_on_image(rgb_np, grayscale_cam, use_rgb=True)

    # convert to PNG base64
    pil_cam = Image.fromarray(cam_image)
    buf = io.BytesIO()
    pil_cam.save(buf, format="PNG")
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode("ascii")
    return f"data:image/png;base64,{b64}"
