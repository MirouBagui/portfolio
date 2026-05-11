import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

function useHashScroll() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')

    function scroll() {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return true
      }
      return false
    }

    if (scroll()) return

    let attempts = 0
    const interval = setInterval(() => {
      if (scroll() || ++attempts > 30) clearInterval(interval)
    }, 100)

    return () => clearInterval(interval)
  }, [hash])
}

export function RootLayout() {
  useHashScroll()

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
