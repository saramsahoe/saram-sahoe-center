import type { Metadata } from "next"
import {
  Accessibility,
  Bus,
  MapPin,
  ParkingSquare,
  TrainFront,
} from "lucide-react"

import { CopyAddressButton } from "@/components/location/copy-address-button"
import { LocationMap } from "@/components/location/location-map"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { transitInfo } from "@/lib/location-content"
import { siteConfig } from "@/lib/navigation"

export const metadata: Metadata = {
  title: "오시는 길",
  description: `${siteConfig.name} 오시는 길 안내 — ${siteConfig.address}`,
}

export default function LocationPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
            Location
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            오시는 길
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            연구센터 사람과 사회를 방문하시는 분들을 위한 위치와 교통 안내입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <LocationMap />

        <Separator className="my-12" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <MapPin className="size-4" strokeWidth={1.5} />
                </span>
                <CardTitle>주소</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-[0.9375rem] leading-relaxed text-pretty text-foreground">
                {siteConfig.address}
              </p>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                상세 층수 및 호실은 1층 안내데스크에서 문의해 주세요.
              </p>
              <div>
                <CopyAddressButton address={siteConfig.address} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <TrainFront className="size-4" strokeWidth={1.5} />
                </span>
                <CardTitle>지하철</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-[0.9375rem] font-medium text-foreground">
                {transitInfo.subway.station}{" "}
                <span className="font-normal text-muted-foreground">
                  ({transitInfo.subway.line})
                </span>
              </p>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {transitInfo.subway.exit
                  ? `${transitInfo.subway.exit} · ${transitInfo.subway.walk}`
                  : transitInfo.subway.walk}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Bus className="size-4" strokeWidth={1.5} />
                </span>
                <CardTitle>버스</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {transitInfo.buses.length > 0
                ? transitInfo.buses.map((bus) => (
                    <div key={bus.stop}>
                      <p className="text-[0.9375rem] font-medium text-foreground">
                        {bus.stop}{" "}
                        <span className="font-mono text-[0.5625rem] tracking-[0.14em] text-muted-foreground uppercase">
                          {bus.type}
                        </span>
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {bus.lines.map((line) => (
                          <Badge key={line}>{line}</Badge>
                        ))}
                      </div>
                    </div>
                  ))
                : (
                    <p className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                      {transitInfo.busNote}
                    </p>
                  )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <ParkingSquare className="size-4" strokeWidth={1.5} />
                </span>
                <CardTitle>주차 및 접근성</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                {transitInfo.parking.visitor}
              </p>
              <div className="flex items-start gap-2">
                <Accessibility
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <p className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                  {transitInfo.parking.accessibility}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
