'use client'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Dashboard from './dashboard/dashboard'
import GuestPage from './guest-page/guest-page'

export default function MainPage() {
  const { isAuthenticated } = useContext(AuthContext)

  return isAuthenticated ? <Dashboard /> : <GuestPage />
}
