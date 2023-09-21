'use client'
import {
  ReactNode,
  createContext,
  useCallback,
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
  register: (data: RestApi.User.CreateRequest) => Promise<void>
  login: (data: RestApi.User.LoginRequest) => Promise<void>
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

  const register = async (data: RestApi.User.CreateRequest) => {
    try {
      const response = await axiosInstance.post('/users', data)
      console.log('response data > ', response.data)
      router.push('/login')

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'You have successfully registered!',
      })
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

  const logout = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await axiosInstance.delete('/users/login')
        console.log('Logged Out!')
        sessionStorage.removeItem('expirationTime')
        setExpirationTime(null)
        setIsAuthenticated(false)
      }
      if (pathname === '/login') {
        router.replace('/login')
      } else if (pathname === '/register') {
        router.replace('/register')
      } else {
        router.replace('/')
      }
    } catch (error) {
      console.error('Logging out failed:', error)
    }
  }, [isAuthenticated, pathname, router])

  const setRefreshTimer = (data: RestApi.User.LoginResponse) => {
    const { expiresIn } = data
    const newExpirationTime = Date.now() + expiresIn * 1000 // Convert expiresIn to milliseconds
    const refreshTimer = newExpirationTime - Date.now()

    // Store expirationTime in the application state and session
    setExpirationTime(newExpirationTime)
    sessionStorage.setItem('expirationTime', newExpirationTime.toString())

    // Schedule a token refresh
    setTimeout(refreshToken, refreshTimer)
  }

  const refreshToken = useCallback(async () => {
    try {
      const response = await axiosInstance.put('/users/login')
      setRefreshTimer(response.data)
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout() // Log out the user if token refresh fails
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout])

  const login = async (data: RestApi.User.LoginRequest) => {
    try {
      const response = await axiosInstance.post('/users/login', data)
      setRefreshTimer(response.data)
      setIsAuthenticated(true)
      router.replace('/')

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'You have successfully logged in!',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login failed:', error.response.data.message)

      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Invalid email or password.',
      })
    }
  }

  // Check expiration time when moving from one page to another
  useEffect(() => {
    if (expirationTime && expirationTime > Date.now()) {
      setIsAuthenticated(true)
      const refreshTimer = expirationTime - Date.now()
      setTimeout(refreshToken, refreshTimer)
    } else {
      logout()
    }
  }, [expirationTime, refreshToken, logout])

  // Redirect a logged-in user trying to access the login page to the home page
  useEffect(() => {
    if (isAuthenticated && pathname === '/login') {
      router.replace('/')
    }
  }, [isAuthenticated, pathname, router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
