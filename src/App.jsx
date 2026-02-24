import "./App.css";
import Home from "./pages/Home.jsx";
import MenPage from "./pages/MensPage/Mens.jsx";
import WomenPage from "./pages/WomensPage/Womens.jsx";
import OurStoryPage from "./pages/OurStoryPage/OurStoryPage.jsx";
import ContactPage from "./pages/ContactPage/ContactPage.jsx";
import { Routes, Route, BrowserRouter } from "react-router";
import { CheckoutPage } from "./components/Nav/Cart/CartItems.jsx"; // Import the CartProvider

import OpenPageAnimation from "./components/OpenPageAnimation/OpenPageAnimation";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import Login from "./pages/LoginPage/Login.jsx";
import LoginFace from "./pages/LoginPage/LoginFace.jsx";
import Register from "./pages/RegisterPage/Register.jsx";
// import MainPage from "./pages/MainPage/MainPage.Jsx";
import Products from "./pages/Shop/Products.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import Dashboard from "./components/Admin/pages/Dashboard/Dashboard.jsx";
import UserManager from "./components/Admin/pages/UserManager.jsx";
import ProductManager from "./components/Admin/pages/ProductManager.jsx";
import OrderManager from "./components/Admin/pages/OrderManager.jsx";
import Analytics from "./components/Admin/pages/Analytics.jsx";
// import error from "./pages/404/404.jsx";
// import Faq from "./components/Admin/pages/FAQ/faq.jsx";

import AdminFAQ from "./components/Admin/pages/FAQ/AdminFAQ.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings.jsx";


// import UpdateProduct from './components/Admin/pages/AdminProducts.jsx';

// import ChatBot from "./components/ChatBot/Chat.jsx";

import { ProductCheckout } from "./pages/ProductsCheckout/ProductCheckout.jsx";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// import axios from "axios";
// import CursorFollower from "./components/CursorFollower";

import SmoothScroll from "./SmoothScroll.jsx";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // ← ADD THIS



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
      {/* <ChatBot/> */}

      {/* <CursorFollower /> */}
      {/* <CheckoutPage> */}
      {/* <BrowserRouter> */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/Home" element={<Home />} /> */}
          <Route path="/For-Men" element={<MenPage />} />
          <Route path="/For-Women" element={<WomenPage />} />
          <Route path="/Our-Story" element={<OurStoryPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductCheckout />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Register" element={<Register />} />
          <Route path="/LoginFace" element={<LoginFace />} />
           
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />


          {/* <Route path="/ChatBot" element={<ChatBot />} /> */}

          <Route 
            path="/admin" 
            element={
             <ProtectedRoute requireAdmin = {true}>
               <AdminLayout />  
             </ProtectedRoute>
             }>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminDashboard />} />
              <Route path="Users" element={<UserManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="faq" element={<AdminFAQ />} />
            
              {/* <Route path="admindasboard" element={<AdminDashboard />} /> */}
              {/* <Route path="UpdateProduct" element={<UpdateProduct/>} /> */}
          </Route>

          {/* <Route path="/error" element ={<error />} /> */}
        </Routes>
      </AuthProvider>
      {/* </BrowserRouter> */}
      {/* </CheckoutPage> */}
    </>
  );
}

export default App;
