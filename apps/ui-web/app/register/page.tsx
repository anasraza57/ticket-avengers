'use client'
import { AuthNavigationContext } from '../../context/AuthNavigationContext'
import { useContext, useEffect } from 'react'
import styles from './page.module.css'
import { Typography, Divider } from '@mui/material'
import AuthButton from '../../components/auth-button/auth-button'
import AuthNavigation from '../../components/auth-navigation/auth-navigation'
import RegisterForm from '../../components/register-form/register-form'
import Link from 'next/link'

export default function Register() {
  const { setActiveStep } = useContext(AuthNavigationContext)

  useEffect(() => {
    setActiveStep(0)
  }, [setActiveStep])

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className={`container ${styles.container}`}>
          <AuthNavigation />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create an account
          </Typography>
          <Typography variant="inherit">
            Already have one? <Link href={'/login'}>Sign in</Link>
          </Typography>
          <RegisterForm />
          <Divider sx={{ fontSize: 12 }}>OR</Divider>
          <AuthButton isGoogle={false} />
          <AuthButton isGoogle />
          <Typography sx={{ fontSize: 12, mt: 2 }}>
            By creating an account, you agree to the <br />
            Ticket Avengers <Link href={''}>Terms of Use</Link> and{' '}
            <Link href={''}>Privacy Policy</Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}
