import { create } from 'zustand'
import { match } from 'ts-pattern'

type Phase = 'typing' | 'pausing' | 'deleting'

interface TypingState {
  displayText: string
  roleIndex: number
  phase: Phase
  tick: (roles: string[]) => void
}

export const useTypingStore = create<TypingState>((set, get) => ({
  displayText: '',
  roleIndex: 0,
  phase: 'typing',
  tick: (roles) => {
    const { displayText, roleIndex, phase } = get()
    const currentRole = roles[roleIndex]

    match(phase)
      .with('typing', () => {
        const next = currentRole.slice(0, displayText.length + 1)
        match(next === currentRole)
          .with(true, () => set({ displayText: next, phase: 'pausing' }))
          .otherwise(() => set({ displayText: next }))
      })
      .with('pausing', () =>
        match(displayText === '')
          .with(true, () => {
            const nextIndex = (roleIndex + 1) % roles.length
            set({ displayText: '', roleIndex: nextIndex, phase: 'typing' })
          })
          .otherwise(() => set({ phase: 'deleting' })),
      )
      .with('deleting', () => {
        const next = currentRole.slice(0, displayText.length - 1)
        match(next === '')
          .with(true, () => set({ displayText: next, phase: 'pausing' }))
          .otherwise(() => set({ displayText: next }))
      })
      .exhaustive()
  },
}))
