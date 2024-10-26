import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './Layouts/main';
import ProtectedRoute, { AdminRoute } from './components/Auth/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api';
import FeedPage from './pages/FeedPage';
import Post from './pages/postPage';
import CategoryPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';
import RecommendedPage from './pages/RecommendedPage';
import CreatePost from './pages/CreatePostPage';
import AuthorPage from './pages/AuthorPostsPage';
import AdminLayout from './pages/admin/AdminLayout';
import Users from './pages/admin/Users';
import TagsCategories from './pages/admin/TagsCategories';


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    id: 'root',
    children: [
      {
        index: true,
        element: <FeedPage />
      },
      {
        path: "/admin",
        element: <AdminRoute>
          <AdminLayout />
        </AdminRoute>,
        children: [
          {
            index: true,
            element: <Users />
          },
          {
            path: "tags-categories",
            element: <TagsCategories />
          }
        ]
      },
      {
        path: "/profile",
        element: <ProtectedRoute>
          <AuthorPage />
        </ProtectedRoute>
      },
      {
        path: "/recommended",
        element: <ProtectedRoute>
          <RecommendedPage />
        </ProtectedRoute>
      },
      {
        path: "/post/create",
        element: <ProtectedRoute>
          <CreatePost />
        </ProtectedRoute>
      },

      {
        path: '/post/:id',
        element: <Post />
      },
      {
        path: '/auth',
        element: <AuthPage />
      },
      {
        path: '/categories',
        element: <CategoryPage />
      },
      {
        path: '/tags',
        element: <TagsPage />
      }]
  }
])

function App() {
  return <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>

}

export default App;
