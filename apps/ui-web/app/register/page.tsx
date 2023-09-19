import Link from 'next/link'
import Image from 'next/image'
import RegisterForm from '../../components/register-form/register-form'
import styles from './page.module.css'
import { Typography, Divider, Button } from '@mui/material'
import AuthNavigation from '../../components/auth-navigation/auth-navigation'

export default function Register() {
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
