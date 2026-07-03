import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function LockIcon() {
  return (
    <svg
      className="inline-block w-3.5 h-3.5 text-amber-500 ml-1.5 -mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )
}

function PostCard({ title, date, excerpt, premium, slug }) {
  return (
    <Link
      to={`/post/${slug}`}
      className="block group border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-sans font-semibold text-white">
          {title}
          {premium && <LockIcon />}
        </h2>
        <time className="shrink-0 text-xs text-zinc-500 mt-1">{date}</time>
      </div>
      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{excerpt}</p>
    </Link>
  )
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-zinc-500 text-sm animate-pulse">Loading posts...</p>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-sans font-semibold text-white mb-6">Posts</h1>
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  )
}
