import { useEffect } from 'react'

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title

    if (description) {
      const existing = document.querySelector('meta[name="description"]')
      if (existing) existing.setAttribute('content', description)

      const og = document.querySelector('meta[property="og:description"]')
      if (og) og.setAttribute('content', description)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)
  }, [title, description])
}
