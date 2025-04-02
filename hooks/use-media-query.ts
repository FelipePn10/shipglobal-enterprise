"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Update the state initially
    setMatches(media.matches)

    // Define a callback function to handle changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // Add the listener to the media query
    media.addEventListener("change", listener)

    // Clean up the listener when the component unmounts
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}

