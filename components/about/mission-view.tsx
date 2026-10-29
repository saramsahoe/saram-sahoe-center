import { Quote } from "lucide-react"

import { TalentFramework } from "@/components/about/talent-framework"
import { directorGreeting } from "@/lib/about-content"

export function MissionView() {
  return (
    <div>
      <span className="font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.16em] text-accent uppercase">
        Our Purpose
      </span>
      <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
        목적 및 비전
      </h2>

      <div className="mt-8">
        <TalentFramework />
      </div>

      <div className="mt-16 max-w-2xl">
        <span className="font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.16em] text-accent uppercase">
          Greeting
        </span>
        <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
          대표 인사말
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
