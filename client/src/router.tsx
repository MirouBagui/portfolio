import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Blog } from "./pages/Blog";
import { blogLoader } from "./pages/blogLoader";
import { NotFound } from "./pages/NotFound";
import { ProjectDetail } from "./pages/ProjectDetail";
import { projectLoader } from "./pages/projectDetailLoader";
import { Home } from "./pages/Home";

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { index: true, path: "/", element: <Home /> },
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
            { path: '*', element: <NotFound /> },
        ],
    },
]);