import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItem = prevItems.find((item) => item.id === product._id);

      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map((item) =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevItems,
          {
            id: product._id,
            name: product.name,
            image: product.image,
            priceCents: product.discountCents || product.priceCents,
            originalPriceCents: product.priceCents,
            discountCents: product.discountCents,
            quantity: quantity,
            category: product.category,
            brand: product.brand,
          },
        ];
      }
    });

    // Show success toast
    showToast(`✓ ${product.name} added to cart!`, "success");
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
      showToast(`${item.name} removed from cart`, "info");
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    // Prevent adding more than 99 items
    if (newQuantity > 99) {
      showToast("Maximum quantity is 99", "warning");
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    const itemCount = cartItems.length;
    setCartItems([]);
    localStorage.removeItem("cart");
    showToast(`Cart cleared! ${itemCount} items removed`, "info");
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.priceCents * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.discountCents && item.originalPriceCents) {
        const savings =
          (item.originalPriceCents - item.discountCents) * item.quantity;
        return total + savings;
      }
      return total;
    }, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const incrementQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const decrementQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `cart-toast cart-toast-${type}`;

    const icon = document.createElement("span");
    icon.className = "toast-icon";

    switch (type) {
      case "success":
        icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        break;
      case "error":
        icon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        break;
      case "warning":
        icon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        break;
      case "info":
        icon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
        break;
      default:
        icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    }

    const text = document.createElement("span");
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        getTotalSavings,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};