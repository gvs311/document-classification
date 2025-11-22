import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OverallMetrics } from "@/lib/types"
import { Target, TrendingUp, Award } from "lucide-react"

interface MetricsCardsProps {
  metrics: OverallMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Accuracy",
      value: (metrics.accuracy * 100).toFixed(2) + "%",
      icon: Target,
      description: "Overall model accuracy",
    },
    {
      title: "Macro F1 Score",
      value: (metrics.macro_f1 * 100).toFixed(2) + "%",
      icon: TrendingUp,
      description: "Unweighted average F1",
    },
    {
      title: "Weighted F1 Score",
      value: (metrics.weighted_f1 * 100).toFixed(2) + "%",
      icon: Award,
      description: "Support-weighted F1",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
