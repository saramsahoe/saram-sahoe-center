import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { introCards } from "@/lib/home-content"

export function IntroGrid() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            센터 소개
          </h2>
          <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
            Quick Links
          </span>
        </div>

        <Separator className="mt-6" />

        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {introCards.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group block h-full outline-none"
              >
                <Card className="h-full ring-1 ring-foreground/10 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md group-hover:ring-accent/30 group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring">
                  <CardHeader>
                    <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-accent uppercase">
                      {card.caption}
                    </span>
                    <CardTitle className="mt-1 flex items-center justify-between gap-2 text-lg">
                      {card.title}
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                      {card.body}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
