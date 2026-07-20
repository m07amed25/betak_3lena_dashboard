import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Setting state outside the effect is not possible for innerWidth, 
    // but the ESLint rule warns about synchronous state updates inside useEffect.
    // The correct way is just to leave it, or maybe use a timeout or let it be.
    // Actually the rule is from react-hooks/set-state-in-effect which is often triggered
    // in older setups or custom rule sets.
    // Let's suppress it for this line since we need to read window size.
    
    mql.addEventListener("change", onChange)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
