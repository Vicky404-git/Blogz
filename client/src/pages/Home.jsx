import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <div className="terminal-box mb-10">
        <p className="text-term-dim mb-1">
          <span className="text-term-accent">vicky@debian:~$</span> cat intro.txt
        </p>
        <br />
        <p>I write about things I build, break, learn, and occasionally fix.</p>
      </div>

      <h2 className="text-2xl text-term-accent font-normal mb-6 border-b border-dashed border-term-border inline-block pb-1">
        ~/posts
      </h2>

      {loading && (
        <p className="text-term-dim">Loading posts...</p>
      )}

      {error && (
        <p className="text-term-dim">Couldn't load posts.</p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="text-term-dim">No posts yet.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="space-y-0">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              to={`/post/${post.slug}`}
              className="block py-5 border-b border-term-border group transition-all"
            >
              <h3 className="text-[1.4rem] text-term-accent font-normal group-hover:shadow-term-glow transition-all">
                {'>> '}{post.title}
              </h3>
              <time className="block text-sm text-term-dim mt-1">{post.date}</time>
              {post.excerpt && (
                <p className="mt-2 text-term-text leading-relaxed">{post.excerpt}</p>
              )}
              <span className="inline-block mt-2 text-sm text-term-dim group-hover:text-term-bright transition-colors">
                Read →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
