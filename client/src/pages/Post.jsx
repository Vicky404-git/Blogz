import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'

function ArrowLeftIcon() {
  return (
    <svg className="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function Paywall({ paymentLink }) {
  return (
    <div className="mt-12 relative">
      <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-zinc-950 pointer-events-none" />
      <div className="border border-amber-500/30 rounded-lg p-6 bg-zinc-900/80 text-center">
        <h3 className="text-base font-sans font-semibold text-white mb-2">
          Unlock Full Post
        </h3>
        <p className="text-sm text-zinc-400 mb-5">
          This is premium content. Pay what you want to unlock the full article.
        </p>
        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-sans font-medium transition-colors"
        >
          Pay via UPI (FamPay)
        </a>
        <p className="mt-3 text-xs text-zinc-600">
          After paying, send the Transaction ID to{' '}
          <a href="mailto:vikasdhruw@duck.com" className="underline underline-offset-2 decoration-zinc-600 hover:decoration-zinc-400">
            vikasdhruw@duck.com
          </a>{' '}
          to unlock.
        </p>
      </div>
    </div>
  )
}

export default function Post() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <p className="text-zinc-500 text-sm animate-pulse">Loading post...</p>
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 mb-4">Post not found.</p>
        <Link to="/" className="text-sm text-zinc-400 hover:text-white underline underline-offset-2">
          <ArrowLeftIcon />
          Back to posts
        </Link>
      </div>
    )
  }

  return (
    <article>
      <Link
        to="/"
        className="inline-flex items-center text-xs text-zinc-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeftIcon />
        Back
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-sans font-bold text-white tracking-tight">
          {post.title}
        </h1>
        <time className="block mt-2 text-sm text-zinc-500">{post.date}</time>
      </header>

      <div className="prose">
        <Markdown>{post.content}</Markdown>
      </div>

      {post.locked && <Paywall paymentLink={post.payment_link} />}
    </article>
  )
}
