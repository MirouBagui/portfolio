import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-8">
            <div className="text-center">
              <p className="mb-2 text-sm font-medium text-red-400">
                Something went wrong
              </p>
              <p className="text-xs text-white/40">
                {this.state.error?.message ?? 'Unknown error'}
              </p>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
