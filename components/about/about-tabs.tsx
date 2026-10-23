"use client"

import { HistoryView } from "@/components/about/history-view"
import { MissionView } from "@/components/about/mission-view"
import { ResearchView } from "@/components/about/research-view"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { HistoryEntry } from "@/lib/history-content"

export type AboutTab = "mission" | "research" | "history"

export function AboutTabs({
  activeTab,
  historyEntries,
  isAdmin,
}: {
  activeTab: AboutTab
  historyEntries: HistoryEntry[]
  isAdmin: boolean
}) {
  return (
    <Tabs value={activeTab}>
      <TabsContent value="mission">
        <MissionView />
      </TabsContent>
      <TabsContent value="research">
        <ResearchView />
      </TabsContent>
      <TabsContent value="history">
        <HistoryView initialEntries={historyEntries} isAdmin={isAdmin} />
      </TabsContent>
    </Tabs>
  )
}
