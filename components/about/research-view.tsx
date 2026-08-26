import { Briefcase } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { businessActivities, programs } from "@/lib/about-content"

export function ResearchView() {
  return (
    <div className="flex flex-col gap-16">
      <div className="max-w-2xl">
        <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-accent uppercase">
          Our Work
        </span>
        <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
          주요 사업 내용
        </h2>

        <ul className="mt-8 flex flex-col gap-4">
          {businessActivities.map((activity) => (
            <li
              key={activity}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Briefcase className="size-4" strokeWidth={1.75} />
              </span>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-foreground">
                {activity}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-accent uppercase">
          Our Programs
        </span>
        <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
          주요 프로그램
        </h2>

        <div className="mt-8 flex flex-col gap-5">
          {programs.map((program, index) => (
            <div
              key={program.title}
              className="rounded-xl border border-border bg-card px-5"
            >
              <div className="flex items-center gap-3 pt-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-heading font-semibold text-accent-foreground">
                  {index + 1}
                </span>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {program.title}
                </h3>
              </div>

              <Accordion type="multiple" className="mt-1">
                {program.groups.map((group) => (
                  <AccordionItem key={group.title} value={group.title}>
                    <AccordionTrigger>{group.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground"
                          >
                            · {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
