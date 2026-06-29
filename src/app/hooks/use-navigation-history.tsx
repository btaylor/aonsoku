import { useEffect, useState } from 'react'
import { useNavigate, useNavigationType } from 'react-router-dom'
import { MouseButton } from '@/utils/browser'

const useNavigationHistory = () => {
  const navigationType = useNavigationType()
  const navigate = useNavigate()

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: using navigationType to trigger
  useEffect(() => {
    setCanGoBack(false)
    setCanGoForward(false)

    const handleHistoryChange = () => {
      setCanGoBack(window.history.state?.idx > 0)
      setCanGoForward(window.history.state?.idx < window.history.length - 1)
    }

    handleHistoryChange()

    window.addEventListener('popstate', handleHistoryChange)

    return () => {
      window.removeEventListener('popstate', handleHistoryChange)
    }
  }, [navigationType])

  const goBack = () => {
    if (canGoBack) navigate(-1)
  }

  const goForward = () => {
    if (canGoForward) navigate(1)
  }

  // Intercept mouse back/forward buttons (3/4) for in-app navigation.
  // Reads window.history.state directly to avoid stale canGoBack/canGoForward closures.
  useEffect(() => {
    const handleMouseButtons = (e: MouseEvent) => {
      if (e.button === MouseButton.Back) {
        e.preventDefault()
        if (window.history.state?.idx > 0) navigate(-1)
      } else if (e.button === MouseButton.Forward) {
        e.preventDefault()
        if (window.history.state?.idx < window.history.length - 1) navigate(1)
      }
    }

    window.addEventListener('mousedown', handleMouseButtons)
    return () => window.removeEventListener('mousedown', handleMouseButtons)
  }, [navigate])

  return { canGoBack, canGoForward, goBack, goForward }
}

export default useNavigationHistory
