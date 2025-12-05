import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'


function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.09,       // smoothness
      wheelMultiplier: 1,
      smoothTouch: true,    // IMPORTANT for iPhone
      touchMultiplier: 1.5, // Fix for iPhone scroll resistance
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return null
}

export default SmoothScroll