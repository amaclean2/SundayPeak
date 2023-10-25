import { useState } from 'react'
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import HomePage from './FirstPage'
import Header from './Header'
import Nav from './Nav'
import PrivacyPolicy from './Privacy'
import SupportPage from './Support'

import './App.css';

const AppContent = () => {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="app-container">
    <Header setNavOpen={setNavOpen} />
    <Outlet />
    <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
    </div>
  )
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={'/'} element={<AppContent />}>
      <Route index element={<HomePage />} />
      <Route path={'privacy'} element={<PrivacyPolicy />} />
      <Route path={'support'} element={<SupportPage />} />
    </Route>
  )
)

export default () => <RouterProvider router={router} />
