import { useEffect, useRef, useState } from 'react'

type ScrollDirection = 'up' | 'down'

export function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState<ScrollDirection>('up')
  const [y, setY] = useState(0)
  const prevY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const diff = scrollY - prevY.current

      // Only re-render when the threshold is crossed — consumers (Navbar)
      // don't need per-pixel updates.
      if (Math.abs(diff) > threshold) {
        setDirection(diff > 0 ? 'down' : 'up')
        setY(scrollY)
        prevY.current = scrollY
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { direction, y }
}
