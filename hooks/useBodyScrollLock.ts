import { useEffect } from "react"

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const originalStyle = window.getComputedStyle(document.body).overflow

    if (isLocked) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isLocked])
}
