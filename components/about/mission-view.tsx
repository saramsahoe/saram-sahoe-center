import { Target } from "lucide-react"

import { missionPurposes } from "@/lib/about-content"

export function MissionView() {
  return (
    <div className="max-w-2xl">
      <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-accent uppercase">
        Our Purpose
      </span>
      <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
        설립 목적
      </h2>

      <ul className="mt-8 flex flex-col gap-4">
        {missionPurposes.map((purpose) => (
          <li
            key={purpose}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Target className="size-4" strokeWidth={1.75} />
            </span>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pretty text-foreground">
              {purpose}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
