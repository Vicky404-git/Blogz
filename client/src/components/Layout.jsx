import Navbar from './Navbar'

export default function Layout({ selectedCategory, setSelectedCategory, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <main className="w-full max-w-[780px] mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
