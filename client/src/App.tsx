import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ParticleBackground } from './components/ParticleBackground';
import { router } from './router';

function App() {
  return (
    <ErrorBoundary>
      <ParticleBackground />
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
