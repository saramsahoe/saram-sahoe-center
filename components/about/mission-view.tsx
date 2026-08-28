import { Quote, Target } from "lucide-react"

import { directorGreeting, missionPurposes } from "@/lib/about-content"

export function MissionView() {
  return (
    <div className="max-w-2xl">
      <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-accent uppercase">
        Our Purpose
      </span>
      <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
        목적 및 비전
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

      <div className="mt-16">
        <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-accent uppercase">
          Greeting
        </span>
        <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
          대표 인삿말
        </h2>

        <div className="relative mt-8 rounded-xl border border-border bg-card p-6 sm:p-10">
          <Quote
            className="size-10 text-accent/25"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <div className="mt-4 flex flex-col gap-4">
            {directorGreeting.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-left text-[0.9375rem] leading-relaxed text-pretty text-foreground"
              >
                {paragraph}
              </p>
            ))}
            <div className="flex flex-col text-right">
              {directorGreeting.signature.map((line, index) => (
                <p
                  key={index}
                  className="font-heading text-[0.9375rem] font-medium text-foreground"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
