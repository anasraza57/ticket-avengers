'use client'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4982fc',
      light: '#d6ddded',
    },
    secondary: {
      main: '#ffdd33',
    },
    error: {
      main: '#E02D3C',
    },
    warning: {
      main: '#F17900',
    },
    info: {
      main: '#007AFF',
    },
    success: {
      main: '#31BA54',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          fontSize: '1.0625rem',
          fontWeight: 700,
          textTransform: 'inherit',
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'inherit' && {
              color: '#14213d',
            }),
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === 'inherit' && {
            fontSize: '0.9375rem',
          }),
        }),
      },
    },
    MuiMobileStepper: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === 'dots' && {
            fontSize: '0.9375rem',
            padding: 0,
          }),
        }),
        dotActive: {
          backgroundColor: '#1c1c1e',
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === 'inherit' && {
            color: '#c7c7cc',
          }),
        }),
      },
    },
  },
})
