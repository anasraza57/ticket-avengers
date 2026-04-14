'use client'
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react'

export interface AuthNavigationContextType {
  activeStep: number
  setActiveStep: Dispatch<SetStateAction<number>>
  handleNext: () => void
  handleBack: () => void
}

const defaultProvider = {
  activeStep: 0,
  setActiveStep: () => null,
  handleNext: () => {},
  handleBack: () => {},
}

const AuthNavigationContext =
  createContext<AuthNavigationContextType>(defaultProvider)

const AuthNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const values = {
    activeStep,
    setActiveStep,
    handleNext,
    handleBack,
  }

  return (
    <AuthNavigationContext.Provider value={values}>
      {children}
    </AuthNavigationContext.Provider>
  )
}

export { AuthNavigationContext, AuthNavigationProvider }
