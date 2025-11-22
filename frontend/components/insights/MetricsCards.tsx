import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OverallMetrics } from "@/lib/types";
import { Target, TrendingUp, Award } from "lucide-react";

interface MetricsCardsProps {
  metrics: OverallMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const formatMetric = (value: number): string => {
    if (isNaN(value) || value === null || value === undefined) {
      return "N/A";
    }
    return (value * 100).toFixed(2) + "%";
  };

  const cards = [
    {
      title: "Accuracy",
      value: formatMetric(metrics.accuracy),
      icon: Target,
      description: "Overall model accuracy",
    },
    {
      title: "Macro F1 Score",
      value: formatMetric(metrics.macro_avg_f1),
      icon: TrendingUp,
      description: "Unweighted average F1",
    },
    {
      title: "Weighted F1 Score",
      value: formatMetric(metrics.weighted_avg_f1),
      icon: Award,
      description: "Support-weighted F1",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
