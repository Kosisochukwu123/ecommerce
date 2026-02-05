import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {CartProvider} from "./components/Nav/Cart/UseCart.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
    
      <BrowserRouter basename="/ecommerce/">
        <App />
      </BrowserRouter>
      
    </CartProvider>
  </StrictMode>
);



