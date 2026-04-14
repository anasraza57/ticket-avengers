'use client'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import styles from './auth-navigation.module.css'
import { Close, KeyboardArrowLeft } from '@mui/icons-material'
import { MobileStepper, Button } from '@mui/material'
import { AuthNavigationContext } from '../../context/AuthNavigationContext'

export default function AuthNavigation() {
  const router = useRouter()
  const theme = useTheme()
  const { activeStep } = useContext(AuthNavigationContext)

  return (
    <div className={styles.headerNavigation}>
      <MobileStepper
        className="stepper"
        variant="dots"
        steps={2}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button color="inherit" size="small" onClick={() => router.push('/')}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft fontSize="large" />
            ) : (
              <Close fontSize="large" />
            )}
          </Button>
        }
        backButton={
          <Button
            color="inherit"
            size="small"
            onClick={() => router.push('/register')}
            disabled={activeStep === 0}
          >
            {theme.direction === 'rtl' ? (
              <Close fontSize="large" />
            ) : (
              <KeyboardArrowLeft fontSize="large" />
            )}
          </Button>
        }
      />
    </div>
  )
}
