import type { Metadata } from "next"

import { getPosts } from "@/app/actions/board"
import { AdminPostList } from "@/components/admin/admin-post-list"
import { PostsLoadError } from "@/components/board/posts-load-error"

export const metadata: Metadata = {
  title: "게시글 관리",
}

export default async function AdminPostsPage() {
  const posts = await getPosts()
  return posts ? <AdminPostList initialPosts={posts} /> : <PostsLoadError />
}
