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

      if (Math.abs(diff) > threshold) {
        setDirection(diff > 0 ? 'down' : 'up')
      }
      prevY.current = scrollY
      setY(scrollY)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { direction, y }
}
