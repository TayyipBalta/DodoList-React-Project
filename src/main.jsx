import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GlobalProvider } from './components/GlobalContext.jsx'

// import Category from './components/Category.jsx'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'

import { Link, Outlet } from 'react-router-dom'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Container />,
    children:[{
      path: '/:boardName',
      element: <Board />,
    },

  ]
  }
])

function Container(){
  return(
    <>
      <GlobalProvider>
        <Header />
        <Board />
      </GlobalProvider>
    </>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)
