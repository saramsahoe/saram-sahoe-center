"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, PenSquare, Plus, Trash2 } from "lucide-react"

import { createNewsSlide, deleteNewsSlide, updateNewsSlide } from "@/app/actions/news"
import { NewsFormDialog, type NewsFormValues } from "@/components/home/news-form-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { NewsSlide } from "@/lib/home-content"

export function NewsCarousel({
  initialSlides,
  isAdmin,
}: {
  initialSlides: NewsSlide[]
  isAdmin: boolean
}) {
  const [slides, setSlides] = useState<NewsSlide[]>(initialSlides)
  const [index, setIndex] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<NewsSlide | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const existingCategories = useMemo(
    () => [...new Set(slides.map((slide) => slide.category))],
    [slides]
  )

  const slide = slides[Math.min(index, slides.length - 1)]

  function goTo(next: number) {
    setIndex((next + slides.length) % slides.length)
  }

  function openAddDialog() {
    setEditingSlide(null)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  function openEditDialog(target: NewsSlide) {
    setEditingSlide(target)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  async function handleSubmit(values: NewsFormValues) {
    setFormSubmitting(true)
    setFormError(null)

    const result = editingSlide
      ? await updateNewsSlide({ id: editingSlide.id, ...values })
      : await createNewsSlide(values)

    setFormSubmitting(false)

    if (result.error || !result.slide) {
      setFormError(result.error ?? "소식을 저장하지 못했습니다.")
      return
    }

    if (editingSlide) {
      setSlides((prev) =>
        prev.map((item) => (item.id === editingSlide.id ? result.slide! : item))
      )
    } else {
      setSlides((prev) => [...prev, result.slide!])
      setIndex(slides.length)
    }

    setFormOpen(false)
    setEditingSlide(null)
  }

  async function handleDelete(target: NewsSlide) {
    if (!window.confirm(`"${target.title}" 소식을 삭제할까요?`)) return

    const result = await deleteNewsSlide(target.id)
    if (result.error) {
      window.alert(result.error)
      return
    }
    setSlides((prev) => prev.filter((item) => item.id !== target.id))
    setIndex(0)
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            소식
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.16em] text-muted-foreground uppercase">
              Latest News
            </span>
            {isAdmin && (
              <Button type="button" size="sm" variant="outline" onClick={openAddDialog}>
                <Plus data-icon="inline-start" className="size-3.5" />
                소식 추가
              </Button>
            )}
          </div>
        </div>

        <Separator className="mt-6" />

        {!slide ? (
          <p className="mt-8 py-16 text-center text-sm text-muted-foreground">
            등록된 소식이 없습니다.
          </p>
        ) : (
          <div className="relative mt-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted sm:aspect-[21/9]">
              {slide.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={slide.id}
                  src={slide.photoUrl}
                  alt={slide.title}
                  className="absolute inset-0 size-full object-cover"
                />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
              />

              <span className="absolute top-4 left-4 inline-flex items-center rounded-sm bg-accent px-2 py-0.5 font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.14em] text-accent-foreground uppercase sm:top-6 sm:left-6">
                {slide.category}
              </span>

              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-1 sm:top-6 sm:right-6">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 bg-background/90"
                    aria-label="소식 수정"
                    onClick={() => openEditDialog(slide)}
                  >
                    <PenSquare className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 bg-background/90 text-destructive hover:text-destructive"
                    aria-label="소식 삭제"
                    onClick={() => handleDelete(slide)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
                <p className="font-mono text-[0.5rem] tracking-[0.16em] text-white/70 uppercase">
                  {slide.date}
                </p>
                <h3 className="mt-2 max-w-2xl font-heading text-lg leading-snug font-semibold text-balance text-white sm:text-2xl">
                  {slide.title}
                </h3>
                <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-pretty text-white/80 sm:block">
                  {slide.summary}
                </p>
              </div>

              {slides.length > 1 && (
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2 sm:px-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur hover:bg-background"
                    onClick={() => goTo(index - 1)}
                    aria-label="이전 소식"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur hover:bg-background"
                    onClick={() => goTo(index + 1)}
                    aria-label="다음 소식"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </div>

            {slides.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-2">
                {slides.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}번째 소식 보기: ${item.title}`}
                    aria-current={i === index}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index
                        ? "w-6 bg-accent"
                        : "w-1.5 bg-border hover:bg-muted-foreground/40"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isAdmin && (
        <NewsFormDialog
          key={formKey}
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) {
              setEditingSlide(null)
              setFormError(null)
            }
          }}
          editingSlide={editingSlide}
          existingCategories={existingCategories}
          onSubmit={handleSubmit}
          error={formError}
          submitting={formSubmitting}
        />
      )}
    </section>
  )
}
