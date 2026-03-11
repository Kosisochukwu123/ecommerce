import "./App.css";
import Home from "./pages/Home.jsx";
import OurStoryPage from "./pages/OurStoryPage/OurStoryPage.jsx";
import ContactPage from "./pages/ContactPage/ContactPage.jsx";
import { Routes, Route, BrowserRouter } from "react-router";
import { CheckoutPage } from "./components/Nav/Cart/CartItems.jsx"; // Import the CartProvider
import OpenPageAnimation from "./components/OpenPageAnimation/OpenPageAnimation";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import Login from "./pages/LoginPage/Login.jsx";
import LoginFace from "./pages/LoginPage/LoginFace.jsx";
import Register from "./pages/RegisterPage/Register.jsx";
import ForgotPassword from './pages/LoginPage/ForgotPassword';
import Products from "./pages/Shop/Products.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import Dashboard from "./components/Admin/pages/Dashboard/Dashboard.jsx";
import UserManager from "./components/Admin/pages/UserManager.jsx";
// import ProductManager from "./components/Admin/pages/ProductManager.jsx";
import OrderManager from "./components/Admin/pages/OrderManager.jsx";
import Analytics from "./components/Admin/pages/Analytics.jsx";
// import error from "./pages/404/404.jsx";
import AdminFAQ from "./components/Admin/pages/FAQ/AdminFAQ.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings.jsx";
import Wishlist from "./pages/WishList/WishList.jsx";
import { CartProvider } from "./components/Nav/Cart/UseCart.jsx";
import ProductManager from "./components/Admin/pages/ProductManager/ProductManager";
import SellProduct from "./pages/SellProduct/SellProduct";
import MySubmissions from "./pages/MySubmissions/MySubmissions";
import SubmissionReview from "./components/Admin/pages/SubmissionReview/SubmissionReview";
// import ChatBot from "./components/ChatBot/Chat.jsx";

import { ProductCheckout } from "./pages/ProductsCheckout/ProductCheckout.jsx";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// import axios from "axios";
// import CursorFollower from "./components/CursorFollower";

import SmoothScroll from "./SmoothScroll.jsx";

// import { ScrollRestoration } from "react-router-dom";
import ScrollRestoration from "./components/ScrollRestore.jsx";

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
      <SmoothScroll />

      <AuthProvider>
        <CartProvider>
        <ScrollRestoration />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Our-Story" element={<OurStoryPage />} />
            <Route path="/Contact" element={<ContactPage />} />
            <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
            <Route path="/Terms" element={<Terms />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductCheckout />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/LoginFace" element={<LoginFace />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/sell" element={<SellProduct />} />
            <Route path="/my-submissions" element={<MySubmissions />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="Users" element={<UserManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="faq" element={<AdminFAQ />} />
              <Route path="submissions" element={<SubmissionReview />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
