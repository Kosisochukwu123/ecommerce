import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'


function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.09,       // smoothness
      wheelMultiplier: 1,
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