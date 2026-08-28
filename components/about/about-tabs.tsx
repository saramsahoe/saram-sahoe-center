"use client"

import { useRouter } from "next/navigation"

import { HistoryView } from "@/components/about/history-view"
import { MissionView } from "@/components/about/mission-view"
import { ResearchView } from "@/components/about/research-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type AboutTab = "mission" | "research" | "history"

export function AboutTabs({ activeTab }: { activeTab: AboutTab }) {
  const router = useRouter()

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => router.push(`/about/${value}`)}
    >
      <TabsList>
        <TabsTrigger value="mission">목적 및 비전 (Mission)</TabsTrigger>
        <TabsTrigger value="research">사업 및 활동분야 (Programs)</TabsTrigger>
        <TabsTrigger value="history">연혁 (History)</TabsTrigger>
      </TabsList>

      <TabsContent value="mission">
        <MissionView />
      </TabsContent>
      <TabsContent value="research">
        <ResearchView />
      </TabsContent>
      <TabsContent value="history">
        <HistoryView />
      </TabsContent>
    </Tabs>
  )
}
