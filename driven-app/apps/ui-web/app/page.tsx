'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { Typography, Button } from '@mui/material'
import SwipeableEdgeDrawer from '../components/swipeable-edge/swipeable-edge'

export default function Index() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <div className={`wrapper ${styles.wrapper}`}>
        <div className="container">
          <Image src="/images/logo.png" width={286} height={286} alt="Logo" />
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
            onClick={() => router.push('/login')}
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
