import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PerClassMetric } from "@/lib/types"

interface PerClassTableProps {
  metrics: PerClassMetric[]
}

export function PerClassTable({ metrics }: PerClassTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Per-Class Metrics</CardTitle>
        <CardDescription>Detailed performance breakdown by document class</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Class Name</TableHead>
                <TableHead className="text-right font-semibold">Precision</TableHead>
                <TableHead className="text-right font-semibold">Recall</TableHead>
                <TableHead className="text-right font-semibold">F1 Score</TableHead>
                <TableHead className="text-right font-semibold">Support</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow key={metric.class_name}>
                  <TableCell className="font-medium">{metric.class_name}</TableCell>
                  <TableCell className="text-right">{(metric.precision * 100).toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{(metric.recall * 100).toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{(metric.f1_score * 100).toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{metric.support}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
