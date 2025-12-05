import "./App.css";
import Home from "./pages/Home.jsx";
import MenPage from "./pages/MensPage/Mens.jsx";
import WomenPage from "./pages/WomensPage/Womens.jsx";
import OurStoryPage from "./pages/OurStoryPage/OurStoryPage.jsx";
import ContactPage from "./pages/ContactPage/ContactPage.jsx";
import { Routes, Route } from "react-router";
import OpenPageAnimation from "./components/OpenPageAnimation/OpenPageAnimation";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import { ProductCheckout } from "./pages/ProductsCheckout/ProductCheckout.jsx";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// import CursorFollower from "./components/CursorFollower";


import SmoothScroll from "./SmoothScroll.jsx";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <OpenPageAnimation />
      <ScrollToTop />
      <SmoothScroll />

      {/* <CursorFollower /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/For-Men" element={<MenPage />} />
        <Route path="/For-Women" element={<WomenPage />} />
        <Route path="/Our-Story" element={<OurStoryPage />} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/products" element={<ProductCheckout />} />
      </Routes>
    </>
  );
}

export default App;
