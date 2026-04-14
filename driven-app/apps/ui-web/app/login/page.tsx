'use client'
import { AuthNavigationContext } from '../../context/AuthNavigationContext'
import { useContext, useEffect } from 'react'
import styles from './page.module.css'
import { Typography, Divider } from '@mui/material'
import AuthButton from '../../components/auth-button/auth-button'
import AuthNavigation from '../../components/auth-navigation/auth-navigation'
import LoginForm from '../../components/login-form/login-form'
import Link from 'next/link'

export default function Login() {
  const { setActiveStep } = useContext(AuthNavigationContext)

  useEffect(() => {
    setActiveStep(1)
  }, [setActiveStep])

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className={`container ${styles.container}`}>
          <AuthNavigation />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sign in
          </Typography>
          <Typography variant="inherit">
            Don&apos;t have an account? <Link href={'/register'}>Sign up</Link>
          </Typography>
          <LoginForm />
          <Divider sx={{ fontSize: 12 }}>OR</Divider>
          <AuthButton isGoogle={false} />
          <AuthButton isGoogle />
        </div>
      </div>
    </div>
  )
}
