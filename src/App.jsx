import "./App.css";
import Home from "./pages/Home.jsx";
import MenPage from "./pages/MensPage/Mens.jsx";
import WomenPage from "./pages/WomensPage/Womens.jsx";
import OurStoryPage from "./pages/OurStoryPage/OurStoryPage.jsx";
import ContactPage from "./pages/ContactPage/ContactPage.jsx";
import { Routes, Route, BrowserRouter } from "react-router";
import { CheckoutPage } from './components/Nav/Cart/CartItems.jsx';     // Import the CartProvider

import OpenPageAnimation from "./components/OpenPageAnimation/OpenPageAnimation";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import Login from "./pages/LoginPage/Login.jsx";
import LoginFace from "./pages/LoginPage/LoginFace.jsx";
import Register from "./pages/RegisterPage/Register.jsx";
import MainPage from "./pages/MainPage/MainPage.Jsx";
// import error from "./pages/404/404.jsx";
import { ProductCheckout } from "./pages/ProductsCheckout/ProductCheckout.jsx";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
// import CursorFollower from "./components/CursorFollower";

import SmoothScroll from "./SmoothScroll.jsx";



function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data);
        } catch (error) {
          setError("Failed to fetch user data");
          localStorage.removeItem("token");
          console.log(error);
          
        }
      }

      if (!token) {
        setUser(null);
        return;
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <OpenPageAnimation />
      <ScrollToTop />
      <SmoothScroll />

      {/* <CursorFollower /> */}
    {/* <CheckoutPage> */}
      {/* <BrowserRouter> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<MainPage />} />
          <Route path="/For-Men" element={<MenPage />} />
          <Route path="/For-Women" element={<WomenPage />} />
          <Route path="/Our-Story" element={<OurStoryPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/products/:id" element={<ProductCheckout />} />
          <Route path="/Login" element={<Login setUser={setUser} />} />
          <Route path="/Register" element={<Register setUser={setUser} />} />
          <Route path="/LoginFace" element={<LoginFace/>} />
          {/* <Route path="/error" element ={<error />} /> */}
        </Routes>

      {/* </BrowserRouter> */}
    {/* </CheckoutPage> */}

    
    </>
  );
}

export default App;
