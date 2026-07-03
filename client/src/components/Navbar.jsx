import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-white font-sans font-semibold tracking-tight">
          ~/blog
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-white">Home</Link>
          <a href="/about" className="hover:text-white">About</a>
        </div>
      </div>
    </nav>
  )
}
