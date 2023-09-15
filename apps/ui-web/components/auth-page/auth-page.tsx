'use client'
import { Typography, Divider, Button } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import AuthNavigation from './auth-navigation/auth-navigation'
import styles from './auth-page.module.css'
import RegisterForm from './register-form/register-form'
import LoginForm from './login-form/login-form'
import { useContext, useEffect } from 'react'
import { AuthNavigationContext } from '../../context/AuthNavigationContext'
import CustomSnackbar from '../custom-snackbar/custom-snackbar'

/* eslint-disable-next-line */
export interface AuthPageProps {
  isRegister: boolean
}

export function AuthPage({ isRegister }: AuthPageProps) {
  const { activeStep, setActiveStep } = useContext(AuthNavigationContext)

  useEffect(() => {
    if (!isRegister) {
      setActiveStep(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegister])

  return (
    <div className={styles.page}>
      <CustomSnackbar />
      <div className="wrapper">
        <div className={`container ${styles.container}`}>
          <AuthNavigation />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isRegister || activeStep === 0 ? 'Create an account' : 'Sign in'}
          </Typography>
          <Typography variant="inherit">
            {isRegister || activeStep === 0 ? (
              <>
                Already have one?{' '}
                <Link href={'/login'} onClick={() => setActiveStep(1)}>
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Link href={'/register'} onClick={() => setActiveStep(0)}>
                  Sign up
                </Link>
              </>
            )}
          </Typography>
          {isRegister || activeStep === 0 ? <RegisterForm /> : <LoginForm />}

          <Divider sx={{ fontSize: 12 }}>OR</Divider>
          <Button
            sx={{ mt: 2 }}
            fullWidth
            color="inherit"
            size="large"
            variant="contained"
            startIcon={
              <Image
                src="/icons/apple-icon.svg"
                alt="google"
                height={20}
                width={20}
              ></Image>
            }
          >
            Continue with Apple
          </Button>
          <Button
            sx={{ mt: 2 }}
            fullWidth
            color="inherit"
            size="large"
            variant="contained"
            startIcon={
              <Image
                src="/icons/google-icon.svg"
                alt="google"
                height={20}
                width={20}
              ></Image>
            }
          >
            Continue with Google
          </Button>
          {(isRegister || activeStep === 0) && (
            <Typography sx={{ fontSize: 12, mt: 2 }}>
              By creating an account, you agree to the <br />
              Ticket Avengers <Link href={''}>Terms of Use</Link> and{' '}
              <Link href={''}>Privacy Policy</Link>
            </Typography>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
