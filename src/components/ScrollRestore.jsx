import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isFirstRender = useRef(true);
  const observerRef = useRef(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const scrollKey = location.pathname;

    if (navigationType === 'POP') {
      const savedPosition = sessionStorage.getItem(`scroll-${scrollKey}`);
      
      if (savedPosition) {
        const targetPosition = parseInt(savedPosition, 10);

        // Wait for content to be added to DOM
        const waitForContent = () => {
          // Create observer to watch for DOM changes
          const observer = new MutationObserver((mutations, obs) => {
            const pageHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const maxScroll = pageHeight - windowHeight;

            // If page is tall enough, restore scroll
            if (targetPosition <= maxScroll) {
              window.scrollTo({
                top: targetPosition,
                behavior: 'instant'
              });
              obs.disconnect(); // Stop observing
            }
          });

          // Observe the entire document for changes
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });

          observerRef.current = observer;

          // Fallback: force scroll after 2 seconds
          setTimeout(() => {
            window.scrollTo({
              top: targetPosition,
              behavior: 'instant'
            });
            observer.disconnect();
          }, 2000);
        };

        // Start waiting for content
        requestAnimationFrame(waitForContent);
      }
    } else {
      window.scrollTo(0, 0);
    }

    // Save scroll position
    let scrollTimer;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        sessionStorage.setItem(`scroll-${scrollKey}`, window.scrollY);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
      sessionStorage.setItem(`scroll-${scrollKey}`, window.scrollY);
      
      // Disconnect observer if it exists
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [location.pathname, navigationType]);

  return null;
};

export default ScrollRestoration;