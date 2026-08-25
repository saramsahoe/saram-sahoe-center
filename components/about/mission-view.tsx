import Image from "next/image"

import { cn } from "@/lib/utils"
import { purposeSections } from "@/lib/about-content"

export function MissionView() {
  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      {purposeSections.map((section, index) => {
        const reversed = index % 2 === 1

        return (
          <div
            key={section.title}
            className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12"
          >
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl bg-muted",
                reversed && "lg:order-2"
              )}
            >
              <Image
                src={section.image}
                alt={section.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className={cn(reversed && "lg:order-1")}>
              <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-accent uppercase">
                {section.eyebrow}
              </span>
              <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
                {section.title}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
                {section.body}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
