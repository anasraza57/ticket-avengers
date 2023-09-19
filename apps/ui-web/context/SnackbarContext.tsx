'use client'
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react'
import { AlertColor } from '@mui/material'

export interface SnackbarType {
  open: boolean
  severity: AlertColor | undefined
  message: string
}

export interface SnackbarContextType {
  snackbar: SnackbarType
  setSnackbar: Dispatch<
    SetStateAction<{
      open: boolean
      severity: AlertColor | undefined
      message: string
    }>
  >
}

const defaultProvider = {
  snackbar: {
    open: false,
    severity: undefined,
    message: '',
  },
  setSnackbar: () => null,
}

const SnackbarContext = createContext<SnackbarContextType>(defaultProvider)

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<SnackbarType>({
    open: false,
    severity: undefined,
    message: '',
  })

  const values = {
    snackbar,
    setSnackbar,
  }

  return (
    <SnackbarContext.Provider value={values}>
      {children}
    </SnackbarContext.Provider>
  )
}

export { SnackbarContext, SnackbarProvider }
