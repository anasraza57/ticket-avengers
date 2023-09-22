'use client'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import axiosInstance from '../utils/axiosConfig'
import { usePathname, useRouter } from 'next/navigation'
import { SnackbarContext } from './SnackbarContext'
import { RestApi } from '@driven-app/shared-types/api'

type AuthContextType = {
  isAuthenticated: boolean
  register: (
    data: RestApi.User.CreateRequest,
    reset?: () => void,
  ) => Promise<void>
  login: (data: RestApi.User.LoginRequest, reset?: () => void) => Promise<void>
  logout: () => void
}

const defaultProvider = {
  isAuthenticated: false,
  register: async () => {},
  login: async () => {},
  logout: () => null,
}

const AuthContext = createContext<AuthContextType>(defaultProvider)

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { setSnackbar } = useContext(SnackbarContext)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [expirationTime, setExpirationTime] = useState<number | null>(
    sessionStorage.getItem('expirationTime')
      ? Number(sessionStorage.getItem('expirationTime'))
      : null,
  )

  const register = async (
    data: RestApi.User.CreateRequest,
    reset?: () => void,
  ) => {
    try {
      const response = await axiosInstance.post('/users', data)
      console.log('response data > ', response.data)
      router.push('/login')

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'You have successfully registered!',
      })
      reset && reset()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Registration failed:', error.response.data.message)

      setSnackbar({
        open: true,
        severity: 'error',
        message: error.response.data.message,
      })
    }
  }

  const logout = async () => {
    try {
      console.log('logout')
      await axiosInstance.delete('/users/login')
      console.log('Logged Out!')
      sessionStorage.removeItem('expirationTime')
      setExpirationTime(null)
      setIsAuthenticated(false)
      router.push('/')
    } catch (error) {
      console.error('Logging out failed:', error)
    }
  }

  const setRefreshTimer = (data: RestApi.User.LoginResponse) => {
    const { expiresIn } = data
    const newExpirationTime = Date.now() + expiresIn * 1000 // Convert expiresIn to milliseconds
    const refreshTimer = newExpirationTime - Date.now()

    // Store expirationTime in the application state and session
    setExpirationTime(newExpirationTime)
    sessionStorage.setItem('expirationTime', newExpirationTime.toString())
    setIsAuthenticated(true)

    // Schedule a token refresh
    setTimeout(refreshToken, refreshTimer)
  }

  const refreshToken = async () => {
    console.log('refreshToken')

    try {
      const response = await axiosInstance.put('/users/login')
      setRefreshTimer(response.data)
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout() // Log out the user if token refresh fails
    }
  }

  const login = async (data: RestApi.User.LoginRequest, reset?: () => void) => {
    try {
      const response = await axiosInstance.post('/users/login', data)
      setRefreshTimer(response.data)

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'You have successfully logged in!',
      })
      reset && reset()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login failed:', error.response.data.message)

      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Invalid email/phone number or password.',
      })
    }
  }

  // Check expiration time on page reload
  useEffect(() => {
    if (expirationTime) {
      refreshToken()
    } else {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Redirect a logged-in user trying to access the login page to the home page
  useEffect(() => {
    if (isAuthenticated && (pathname === '/login' || pathname === '/')) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, pathname, router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
