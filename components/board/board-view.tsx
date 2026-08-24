"use client"

import { useMemo, useState } from "react"
import { PenSquare, Search } from "lucide-react"

import { Pagination } from "@/components/board/pagination"
import { PostDetailDialog } from "@/components/board/post-detail-dialog"
import {
  PostFormDialog,
  type PostFormValues,
} from "@/components/board/post-form-dialog"
import { PostList } from "@/components/board/post-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  categoryFilters,
  mockPosts,
  type Post,
  type PostCategory,
} from "@/lib/board-content"

const PAGE_SIZE = 8

export function BoardView() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [category, setCategory] = useState<PostCategory | "all">("all")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formKey, setFormKey] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesCategory = category === "all" || post.category === category
      const matchesQuery =
        q.length === 0 ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [posts, category, query])

  const pinnedPosts = useMemo(
    () => filtered.filter((post) => post.pinned),
    [filtered]
  )
  const regularPosts = useMemo(
    () => filtered.filter((post) => !post.pinned),
    [filtered]
  )

  const pageCount = Math.max(1, Math.ceil(regularPosts.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pagePosts = regularPosts.slice(startIndex, startIndex + PAGE_SIZE)

  function handleCategoryChange(next: PostCategory | "all") {
    setCategory(next)
    setPage(1)
  }

  function handleSearch(value: string) {
    setQuery(value)
    setPage(1)
  }

  function openWriteDialog() {
    setEditingPost(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  function openEditDialog(post: Post) {
    setEditingPost(post)
    setSelectedPost(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  function handleSubmit(values: PostFormValues) {
    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                ...values,
                excerpt: values.content.slice(0, 60),
              }
            : post
        )
      )
    } else {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        category: values.category,
        title: values.title,
        author: "익명",
        date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
        views: 0,
        pinned: false,
        attachments: [],
        excerpt: values.content.slice(0, 60),
        content: values.content,
      }
      setPosts((prev) => [newPost, ...prev])
      setPage(1)
    }
    setFormOpen(false)
    setEditingPost(null)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="게시글 분류 필터"
          className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1"
        >
          {categoryFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={category === filter.value}
              onClick={() => handleCategoryChange(filter.value)}
              className={cn(
                "rounded-full px-4 py-2 font-heading text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
                category === filter.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <Button
          type="button"
          onClick={openWriteDialog}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <PenSquare data-icon="inline-start" />
          글쓰기 (Write Post)
        </Button>
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="제목 또는 내용으로 검색"
          className="pl-8"
        />
      </div>

      <div className="mt-6">
        <PostList
          pinnedPosts={currentPage === 1 ? pinnedPosts : []}
          posts={pagePosts}
          startNo={startIndex + 1}
          onSelect={setSelectedPost}
        />
      </div>

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        onPageChange={setPage}
      />

      <PostDetailDialog
        post={selectedPost}
        onOpenChange={(open) => {
          if (!open) setSelectedPost(null)
        }}
        onEdit={openEditDialog}
      />

      <PostFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingPost(null)
        }}
        editingPost={editingPost}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
