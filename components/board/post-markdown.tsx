"use client"

import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getYoutubeEmbedUrl } from "@/lib/board-content"
import { cn } from "@/lib/utils"

function PostLink({ href, children }: { href?: string; children?: ReactNode }) {
  const embedUrl = href ? getYoutubeEmbedUrl(href) : null
  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title="유튜브 동영상"
        className="my-3 aspect-video w-full max-w-full rounded-lg border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    )
  }
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export function PostMarkdown({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "text-[0.9375rem] leading-relaxed text-pretty text-foreground",
        "[&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_h2]:mt-7 [&_h2]:mb-2 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:first:mt-0",
        "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold",
        "[&_strong]:font-semibold [&_em]:italic",
        "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4",
        "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-lg",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: PostLink }}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
