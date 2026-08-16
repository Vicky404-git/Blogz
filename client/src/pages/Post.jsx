import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'

export default function Post() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data) => {
        setPost(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <p className="text-term-dim">Loading post...</p>
  }

  if (error || !post) {
    return (
      <div className="text-center py-20">
        <p className="text-term-dim mb-4">Post not found.</p>
        <Link to="/" className="text-term-accent underline underline-offset-2">
          ← Back to posts
        </Link>
      </div>
    )
  }

  return (
    <article>
      <Link
        to="/"
        className="inline-block text-term-accent mb-8 transition-all hover:shadow-term-glow"
      >
        ← Back
      </Link>

      <header className="mb-8">
        <h1 className="text-[2.4rem] text-term-bright font-normal leading-tight" style={{ textShadow: 'var(--accent-glow)' }}>
          {post.title}
        </h1>
        <time className="block mt-2 text-sm text-term-dim">{post.date}</time>
      </header>

      <div className="terminal-box">
        <div className="prose">
          <Markdown>{post.content}</Markdown>
        </div>
      </div>
    </article>
  )
}
