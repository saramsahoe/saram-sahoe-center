"use client"

import { useState, type ReactNode } from "react"
import { Image as ImageIcon, PenSquare, Trash2 } from "lucide-react"

import {
  createHistoryEntry,
  deleteHistoryEntry,
  reorderHistoryEntries,
  updateHistoryEntry,
} from "@/app/actions/history"
import { SortableList } from "@/components/admin/sortable-list"
import {
  HistoryFormDialog,
  type HistoryFormValues,
} from "@/components/about/history-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { HistoryEntry } from "@/lib/history-content"

function HistoryRow({
  entry,
  isFirstOfGroup,
  isLast,
  isAdmin,
  dragHandle,
  onOpenPhoto,
  onEdit,
  onDelete,
}: {
  entry: HistoryEntry
  isFirstOfGroup: boolean
  isLast: boolean
  isAdmin: boolean
  dragHandle?: ReactNode
  onOpenPhoto: (url: string) => void
  onEdit: (entry: HistoryEntry) => void
  onDelete: (entry: HistoryEntry) => void
}) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-4 pb-5 sm:grid-cols-[2.5rem_1fr] sm:gap-6">
      <div className="relative w-full">
        <span
          aria-hidden="true"
          className="absolute top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background"
        />
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute top-1 left-1/2 h-[calc(100%+1.25rem)] w-px -translate-x-1/2 bg-border"
          />
        )}
      </div>

      <div>
        {isFirstOfGroup && (
          <Badge variant="accent" className="mb-4 font-mono">
            {entry.year}
          </Badge>
        )}

        <div className="flex items-start gap-3">
          {dragHandle}
          <button
            type="button"
            onClick={() => entry.photoUrl && onOpenPhoto(entry.photoUrl)}
            disabled={!entry.photoUrl}
            className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted disabled:cursor-default"
          >
            {entry.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={entry.photoUrl} alt="" className="size-full object-cover" />
            ) : (
              <ImageIcon className="size-5 text-muted-foreground" strokeWidth={1.5} />
            )}
          </button>

          <div className="flex-1">
            <p className="font-heading text-sm font-semibold text-foreground">
              {entry.title}
            </p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
              {entry.description}
            </p>
          </div>

          {isAdmin && (
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={`${entry.title} 수정`}
                onClick={() => onEdit(entry)}
              >
                <PenSquare className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-destructive hover:text-destructive"
                aria-label={`${entry.title} 삭제`}
                onClick={() => onDelete(entry)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function HistoryView({
  initialEntries,
  isAdmin,
}: {
  initialEntries: HistoryEntry[]
  isAdmin: boolean
}) {
  const [entries, setEntries] = useState<HistoryEntry[]>(initialEntries)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HistoryEntry | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  function openAddDialog() {
    setEditingEntry(null)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  function openEditDialog(entry: HistoryEntry) {
    setEditingEntry(entry)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  async function handleSubmit(values: HistoryFormValues) {
    setFormSubmitting(true)
    setFormError(null)

    const result = editingEntry
      ? await updateHistoryEntry({ id: editingEntry.id, ...values })
      : await createHistoryEntry(values)

    setFormSubmitting(false)

    if (result.error || !result.entry) {
      setFormError(result.error ?? "연혁을 저장하지 못했습니다.")
      return
    }

    if (editingEntry) {
      setEntries((prev) =>
        prev.map((entry) => (entry.id === editingEntry.id ? result.entry! : entry))
      )
    } else {
      setEntries((prev) => [...prev, result.entry!])
    }

    setFormOpen(false)
    setEditingEntry(null)
  }

  async function handleDelete(entry: HistoryEntry) {
    if (!window.confirm(`"${entry.title}" 연혁을 삭제할까요?`)) return

    const result = await deleteHistoryEntry(entry.id)
    if (result.error) {
      window.alert(result.error)
      return
    }
    setEntries((prev) => prev.filter((e) => e.id !== entry.id))
  }

  async function handleReorder(nextEntries: HistoryEntry[]) {
    setEntries(nextEntries)
    await reorderHistoryEntries(nextEntries.map((entry) => entry.id))
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Button
            type="button"
            onClick={openAddDialog}
            className="bg-button text-button-foreground hover:bg-button/90"
          >
            <PenSquare data-icon="inline-start" />
            연혁 추가
          </Button>
        </div>
      )}

      {entries.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          등록된 연혁이 없습니다.
        </p>
      ) : isAdmin ? (
        <SortableList
          items={entries}
          onReorder={handleReorder}
          renderItem={(entry, dragHandle, index) => (
            <HistoryRow
              entry={entry}
              isFirstOfGroup={index === 0 || entries[index - 1].year !== entry.year}
              isLast={index === entries.length - 1}
              isAdmin
              dragHandle={dragHandle}
              onOpenPhoto={setLightboxUrl}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
        />
      ) : (
        entries.map((entry, index) => (
          <HistoryRow
            key={entry.id}
            entry={entry}
            isFirstOfGroup={index === 0 || entries[index - 1].year !== entry.year}
            isLast={index === entries.length - 1}
            isAdmin={false}
            onOpenPhoto={setLightboxUrl}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        ))
      )}

      <Dialog
        open={lightboxUrl !== null}
        onOpenChange={(open) => !open && setLightboxUrl(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle className="sr-only">연혁 사진</DialogTitle>
          {lightboxUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lightboxUrl} alt="" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>

      {isAdmin && (
        <HistoryFormDialog
          key={formKey}
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) {
              setEditingEntry(null)
              setFormError(null)
            }
          }}
          editingEntry={editingEntry}
          onSubmit={handleSubmit}
          error={formError}
          submitting={formSubmitting}
        />
      )}
    </div>
  )
}
