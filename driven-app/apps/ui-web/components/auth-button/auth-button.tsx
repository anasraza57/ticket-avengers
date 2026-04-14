import { Button } from '@mui/material'
import Image from 'next/image'

export interface AuthButtonProps {
  isGoogle: boolean
}

export default function AuthButton({ isGoogle }: AuthButtonProps) {
  return (
    <Button
      sx={{ mt: 2 }}
      fullWidth
      color="inherit"
      size="large"
      variant="contained"
      startIcon={
        <Image
          src={isGoogle ? '/icons/google-icon.svg' : '/icons/apple-icon.svg'}
          alt="apple"
          height={20}
          width={20}
        ></Image>
      }
    >
      Continue with {isGoogle ? 'Google' : 'Apple'}
    </Button>
  )
}
