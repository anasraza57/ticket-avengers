'use client'
import { Button, Typography } from '@mui/material'
import styles from './main-page.module.css'
import Image from 'next/image'
import SwipeableEdgeDrawer from '../swipeable-edge/swipeable-edge'
import { useRouter } from 'next/navigation'
import profileImage from '../../public/images/logo.png'

export default function MainPage() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <div className={`wrapper ${styles.wrapper}`}>
        <div className="container">
          <Image src={profileImage} width={286} height={286} alt="Logo" />
          <Typography variant="inherit">
            Can&apos;t handle another fine?
          </Typography>
          <Typography variant="inherit">
            We will cover it now. You pay us back later.
          </Typography>
          <Button
            sx={{ marginTop: 2 }}
            size="large"
            variant="contained"
            fullWidth
          >
            Log in
          </Button>
          <Button
            color="inherit"
            size="large"
            sx={{ marginTop: 2 }}
            variant="contained"
            fullWidth
            onClick={() => router.push('/register')}
          >
            Create an account
          </Button>
          <SwipeableEdgeDrawer />
        </div>
      </div>
    </div>
  )
}
