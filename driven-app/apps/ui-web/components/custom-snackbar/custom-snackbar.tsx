'use client'
import { Dispatch, SetStateAction, forwardRef, useContext } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'
import { SnackbarContext } from '../../context/SnackbarContext'

export interface CustomSnackbarProps {
  open: boolean
  setOpen: Dispatch<
    SetStateAction<{
      open: boolean
      severity: AlertColor | undefined
      message: string
    }>
  >
  message: string
  severity: AlertColor | undefined
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  },
)

export default function CustomSnackbar() {
  const { snackbar, setSnackbar } = useContext(SnackbarContext)

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Snackbar
      open={snackbar?.open}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar?.severity}
        sx={{ width: '100%' }}
      >
        {snackbar?.message}
      </Alert>
    </Snackbar>
  )
}
