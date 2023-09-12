'use client'
import React from 'react'
import createEmotionCache from '../utils/createEmotionCache'

const EmotionCacheContext = React.createContext<unknown>(null)

export const EmotionCacheProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const cache = createEmotionCache()
  return (
    <EmotionCacheContext.Provider value={cache}>
      {children}
    </EmotionCacheContext.Provider>
  )
}

export const useEmotionCache = () => {
  return React.useContext(EmotionCacheContext)
}
