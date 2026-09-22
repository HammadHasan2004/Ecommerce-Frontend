import Navbar from './Navbar'

export default function Layout({ children, className = '' }) {
  return (
    <div className="min-h-screen bg-[#F5EFE4] flex flex-col">
      <Navbar />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
    </div>
  )
}
