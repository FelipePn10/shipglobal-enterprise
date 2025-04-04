"use client"

import { useState, useEffect } from "react"

export function useAnimation(delay = 0, duration = 300) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return isAnimating
}

