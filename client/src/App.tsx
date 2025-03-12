import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Error from "./components/Error"
import Dashboard from "./pages/Dashboard"
import Main from "./layout/Main"
import PrivateRoute from "./components/PrivateRoute"
import { Toaster } from 'react-hot-toast'
import DefaultRoute from "./components/DefaultRoute"
import Budgets from "./pages/Budgets"
import Expenses from "./pages/Expenses"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BudgetPageById from "./pages/BudgetPageById"
import ErrorSidebar from "./components/ErrorSidebar"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:  <DefaultRoute children={<Home />} />,
      errorElement: <Error />
    },
    {
      path: "/sign-in",
      element: <DefaultRoute children={<Login />} />,
      errorElement: <Error />
    },
    {
      path: "/register",
      element: <DefaultRoute children={<Register />} />,
      errorElement: <Error />
    },
    {
      path: "/main",
      element: <PrivateRoute children={<Main />} />,
      errorElement: <ErrorSidebar />,
      children: [
        {
          index: true,
          element: <Dashboard />,
          errorElement: <ErrorSidebar />
        },
        {
          path: "budgets",
          element: <Budgets />,
          errorElement: <ErrorSidebar />,
        },
        {
          path: "budgets/:id",
          element: <BudgetPageById />,
          errorElement: <ErrorSidebar />,
        },
        {
          path: "expenses",
          element: <Expenses/>,
          errorElement: <ErrorSidebar />
        },
      ]
    }
  ])

  const queryClient = new QueryClient() 

  return (
    <>
      <QueryClientProvider client={queryClient}>

        <RouterProvider router={router} />
        <Toaster toastOptions={{
          className: "font-inter"
        }} />
      </QueryClientProvider>
    </>
  )
}

export default App
