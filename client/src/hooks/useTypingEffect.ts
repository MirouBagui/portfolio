import { useEffect, useRef } from 'react'
import { useTypingStore } from '../stores/typingStore'
import { match } from 'ts-pattern'

const DELAYS = {
  typing: 100,
  pausing: 2000,
  deleting: 50,
} as const

export function useTypingEffect(roles: string[]) {
  const displayText = useTypingStore((s) => s.displayText)
  const phase = useTypingStore((s) => s.phase)
  const tick = useTypingStore((s) => s.tick)

  const rolesRef = useRef(roles)

  useEffect(() => {
    rolesRef.current = roles

    const delay = match(phase)
      .with('typing', () => DELAYS.typing)
      .with('pausing', () => DELAYS.pausing)
      .with('deleting', () => DELAYS.deleting)
      .exhaustive()

    const timeout = setTimeout(() => tick(rolesRef.current), delay)
    return () => clearTimeout(timeout)
  }, [roles, displayText, phase, tick])

  return displayText
}
