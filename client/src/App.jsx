import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Post from './pages/Post'

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <Layout
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
    >
      <Routes>
        <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
        <Route path="/post/*" element={<Post />} />
      </Routes>
    </Layout>
  )
}