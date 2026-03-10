import "./CartItems.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./UseCart";
import emptyCart from "../../../../public/images/empty-cart.png";

export const CheckoutPage = ({ showCheckout, setShowCheckout }) => {
  const {
    cartItems,
    removeFromCart,
    getTotalPrice,
    getTotalSavings,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalItems,
  } = useCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (showCheckout) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [showCheckout]);

  const handleClearCart = () => {
    setShowClearConfirm(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const savings = getTotalSavings();

  // Don't render anything if not showing
  if (!showCheckout) return null;

  return (
    <>
      {/* CHECKOUT OVERLAY - CLICK OUTSIDE TO CLOSE */}
      <div 
        className="checkout-backdrop" 
        onClick={() => setShowCheckout(false)}
      >
        <div
          className="popup-content-cart"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* HEADER */}
          <div className="cartItem-top">
            <div className="cart-header-info">
              <h2>Your Cart</h2>
              <p className="cart-item-count">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              className="close-btn"
              onClick={() => setShowCheckout(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* CLEAR ALL BUTTON */}
          {cartItems.length > 0 && (
            <div className="cart-actions-bar">
              <button className="clear-all-btn" onClick={handleClearCart}>
                <i className="fa-solid fa-trash-can"></i>
                Clear All
              </button>
            </div>
          )}

          {/* CART BODY */}
          <div className="cartItem-body">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <img
                  src={emptyCart}
                  alt="Empty cart"
                  className="empty-cart-image"
                />
                <h3>Your cart is empty</h3>
                <p>Add something nice — you deserve it! 🛍️</p>
                <Link
                  to="/products"
                  className="empty-cart-btn"
                  onClick={() => setShowCheckout(false)}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  Start Shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cartItem-container">
                  <div className="cartItem-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cartItem-content">
                    <div className="cartItem-content-top">
                      <p className="cart-item-name">{item.name}</p>
                      <div className="cart-item-price-group">
                        <span className="cart-current-price">
                          ${(item.priceCents / 100).toFixed(2)}
                        </span>
                        {item.discountCents &&
                          item.originalPriceCents &&
                          item.discountCents < item.originalPriceCents && (
                            <span className="cart-original-price">
                              ${(item.originalPriceCents / 100).toFixed(2)}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="cartItem-content-bottom">
                      <div className="cartItem-content-bottom-top">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          className="qty-decrease"
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          disabled={item.quantity >= 99}
                          className="qty-increase"
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>

                      <span className="item-subtotal">
                        ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                      </span>

                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CART BOTTOM (SUMMARY) */}
          {cartItems.length > 0 && (
            <div className="cartItem-bottom">
              {savings > 0 && (
                <div className="cartItem-savings">
                  <p>You're saving</p>
                  <span className="savings-amount">
                    -${(savings / 100).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="cartItem-shipping">
                <p>Shipping</p>
                <span>Calculated at checkout</span>
              </div>

              <div className="cartItem-total">
                <p>Total:</p>
                <span>${(getTotalPrice() / 100).toFixed(2)}</span>
              </div>

              <div className="cartItem-button">
                <button className="checkout-main-btn">
                  <i className="fa-solid fa-lock"></i>
                  Checkout
                </button>
              </div>

              <button
                className="continue-shopping-link"
                onClick={() => setShowCheckout(false)}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CLEAR CART CONFIRMATION MODAL */}
      {showClearConfirm && (
        <div
          className="confirm-overlay"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon-wrapper">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3>Clear Cart?</h3>
            <p>
              Are you sure you want to remove all {cartItems.length} items from
              your cart?
            </p>
            <div className="confirm-actions">
              <button
                className="confirm-cancel-btn"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button className="confirm-clear-btn" onClick={confirmClearCart}>
                Yes, Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};