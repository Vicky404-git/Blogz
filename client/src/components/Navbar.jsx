import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function getCategories(posts) {
  const dirs = new Set()
  posts.forEach((post) => {
    const parts = post.slug.split('/')
    if (parts.length > 1) dirs.add(parts[0])
  })
  return [...dirs].sort()
}

export default function Navbar({ selectedCategory, setSelectedCategory }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || ''
    fetch(`${API_URL}/api/posts`)
      .then((r) => r.json())
      .then((data) => setCategories(getCategories(data)))
      .catch(() => setCategories([]))
  }, [])

  const selectCategory = (category) => {
    setSelectedCategory((current) => (current === category ? null : category))
    setMenuOpen(false)
  }

  return (
    <header className="w-full border-b border-term-border sticky top-0 z-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.96)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-[780px] mx-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-term-accent">{'>'}_</span>
            <span className="text-[1.9rem] text-term-accent" style={{ textShadow: 'var(--accent-glow)' }}>Vikas Dhruw</span>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-term-accent bg-term-card border border-term-border px-3 py-2 cursor-pointer transition-all hover:border-term-accent hover:shadow-term-glow font-[inherit] text-base whitespace-nowrap"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            {menuOpen ? 'vicky@debian:~$ tree' : 'vicky@debian:~$ ls'}
          </button>
        </div>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} flex-col w-full gap-3 pt-4 border-t border-dashed border-term-border`} style={{ animation: 'terminalFade 0.2s ease' }}>
          <button
            onClick={() => selectCategory(null)}
            className="text-left text-term-accent cursor-pointer transition-all hover:shadow-term-glow font-[inherit] bg-transparent border-none p-0"
          >
            {'>> '}~/posts (all)
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => selectCategory(category)}
              className="text-left text-term-accent cursor-pointer transition-all hover:shadow-term-glow font-[inherit] bg-transparent border-none p-0"
            >
              {'>> '}~/posts/{category}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}