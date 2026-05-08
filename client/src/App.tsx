import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'
import { projectLoader } from './pages/projectDetailLoader'
import { Blog } from './pages/Blog'
import { blogLoader } from './pages/blogLoader'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'projects/:id',
        element: <ProjectDetail />,
        loader: projectLoader,
      },
      {
        path: 'blog',
        element: <Blog />,
        loader: blogLoader,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
