import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ParticleBackground } from './components/ParticleBackground';
import { CustomCursor } from './components/CustomCursor';
import { router } from './router';

function App() {
  return (
    <ErrorBoundary>
      <ParticleBackground />
      <CustomCursor />
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
