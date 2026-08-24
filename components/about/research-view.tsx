import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { researchAreas } from "@/lib/about-content"

export function ResearchView() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {researchAreas.map((area) => {
        const Icon = area.icon

        return (
          <li key={area.title}>
            <Card className="h-full">
              <CardHeader>
                <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-muted">
                  <Icon
                    className="size-9 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
                <CardTitle className="text-base">{area.title}</CardTitle>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {area.keywords.map((keyword) => (
                    <Badge key={keyword}>{keyword}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                  {area.description}
                </p>
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
