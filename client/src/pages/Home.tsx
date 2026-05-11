import { lazy, Component, type ReactNode } from 'react'
import { Hero } from '../components/Hero'
import { usePortfolioStore } from '../stores/portfolioStore'
import { usePageMeta } from '../hooks/usePageMeta'

const About = lazy(() =>
  import('../components/About').then((m) => ({ default: m.About })),
)
const Projects = lazy(() =>
  import('../components/Projects').then((m) => ({ default: m.Projects })),
)
const Contact = lazy(() =>
  import('../components/Contact').then((m) => ({ default: m.Contact })),
)

function onIdle(children: ReactNode) {
  if ('requestIdleCallback' in window) {
    return (
      <IdleBoundary>{children}</IdleBoundary>
    )
  }
  return <>{children}</>
}

class IdleBoundary extends Component<{ children: ReactNode }> {
  state = { ready: false }
  private idleId: number | null = null

  componentDidMount() {
    this.idleId = requestIdleCallback(() => this.setState({ ready: true }), {
      timeout: 500,
    })
  }

  componentWillUnmount() {
    if (this.idleId !== null) cancelIdleCallback(this.idleId)
  }

  render() {
    return this.state.ready ? (
      <>{this.props.children}</>
    ) : (
      <div className="min-h-screen" />
    )
  }
}

export function Home() {
  const { name } = usePortfolioStore()
  usePageMeta(`${name} — Full Stack Developer`)

  return (
    <>
      <Hero />
      {onIdle(
        <>
          <About />
          <Projects />
          <Contact />
        </>,
      )}
    </>
  )
}
