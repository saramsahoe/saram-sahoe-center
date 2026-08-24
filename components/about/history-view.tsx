import { Badge } from "@/components/ui/badge"
import { historyTimeline } from "@/lib/about-content"

export function HistoryView() {
  return (
    <ol className="flex flex-col gap-10">
      {historyTimeline.map((year, index) => {
        const isLast = index === historyTimeline.length - 1

        return (
          <li
            key={year.year}
            className="grid grid-cols-[2rem_1fr] gap-4 sm:grid-cols-[2.5rem_1fr] sm:gap-6"
          >
            <div className="relative w-full">
              <span
                aria-hidden="true"
                className="absolute top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background"
              />
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 left-1/2 h-[calc(100%+2.5rem)] w-px -translate-x-1/2 bg-border"
                />
              )}
            </div>

            <div>
              <Badge variant="accent" className="font-mono">
                {year.year}
              </Badge>

              <ul className="mt-4 flex flex-col gap-5">
                {year.milestones.map((milestone) => {
                  const Icon = milestone.icon

                  return (
                    <li key={milestone.title} className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon
                          className="size-5 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="font-heading text-sm font-semibold text-foreground">
                          {milestone.title}
                        </p>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
