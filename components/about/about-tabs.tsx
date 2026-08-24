"use client"

import { useRouter } from "next/navigation"

import { HistoryView } from "@/components/about/history-view"
import { PurposeView } from "@/components/about/purpose-view"
import { ResearchView } from "@/components/about/research-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type AboutTab = "purpose" | "research" | "history"

export function AboutTabs({ activeTab }: { activeTab: AboutTab }) {
  const router = useRouter()

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => router.push(`/about/${value}`)}
    >
      <TabsList>
        <TabsTrigger value="purpose">단체 목적 (Purpose)</TabsTrigger>
        <TabsTrigger value="research">연구 분야 (Research Areas)</TabsTrigger>
        <TabsTrigger value="history">연혁 (History)</TabsTrigger>
      </TabsList>

      <TabsContent value="purpose">
        <PurposeView />
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
