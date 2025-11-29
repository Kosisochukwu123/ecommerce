import React, { useState, useEffect } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50; // change 50 to whatever pixel you want
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    // cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg'     // scrolled state
          : 'bg-transparent'                            // hero/transparent state
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${
          scrolled ? 'text-gray-900' : 'text-white'
        }`}>
          MyLogo
        </h1>

        <div className="space-x-8">
          {['Home', 'About', 'Services', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`font-medium transition-colors duration-300 ${
                scrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-gray-200'
              }`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Your Hero Section (for context)
function Hero() {
  return (
    <section className="h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6">Welcome to My Site</h1>
        <p className="text-xl">Scroll down to see the navbar change</p>
      </div>
    </section>
  );
}

// App component
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="h-screen bg-gray-100" />   {/* just some content to scroll */}
      <div className="h-screen bg-gray-200" />
    </>
  );
}