import "./CartItems.css";
import "./CheckoutPage.css"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/UseCart";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../api/orders";
import emptyCart from "../../../../public/images/empty-cart.png";

export const CheckoutPage = ({ showCheckout, setShowCheckout }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { cartItems, removeFromCart, getTotalPrice, updateQuantity, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (showCheckout) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [showCheckout]);

  const handleCheckout = async () => {
    // Check if user is logged in
    if (!user) {
      alert("Please login to checkout");
      setShowCheckout(false);
      navigate("/Login");
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.id,
          productName: item.name,
          productImage: item.image,
          quantity: item.quantity,
          priceCents: item.priceCents,
        })),
        totalCents: getTotalPrice(),
        shippingAddress: {
          street: "Default Address", // You can add address selection later
          city: "City",
          state: "State",
          zipCode: "00000",
          country: "Country",
        },
        paymentMethod: "credit_card",
      };

      // Create order
      const response = await createOrder(token, orderData);
      
      alert(`Order placed successfully! Order #${response.order.orderNumber}`);
      
      // Clear cart
      clearCart();
      
      // Close checkout
      setShowCheckout(false);
      
      // Navigate to orders page or success page
      navigate("/profile"); // You can create an order success page later
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* CHECKOUT POPUP */}
      {showCheckout && (
        <div className="checkout-overlay" onClick={() => setShowCheckout(false)}>
          <div
            className="popup-content-cart"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cartItem-top">
              <h2>Your Cart ({cartItems.length})</h2>
              <button className="close-btn" onClick={() => setShowCheckout(false)}>
                ✕
              </button>
            </div>

            <div className="cartItem-body">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <img
                    src={emptyCart}
                    alt="Empty cart"
                    className="empty-cart-image"
                  />
                  <h3>Your cart is empty</h3>
                  <p>Add something nice — you deserve it 🙂</p>
                  <Link
                    to="/products"
                    className="empty-cart-btn"
                    onClick={() => setShowCheckout(false)}
                  >
                    Continue Shopping
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
                        <p>{item.name}</p>
                        <span>${(item.priceCents / 100).toFixed(2)}</span>
                      </div>

                      <div className="cartItem-content-bottom">
                        <div className="cartItem-content-bottom-top">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove from cart"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cartItem-bottom">
                <div className="cartItem-shipping">
                  <p>Shipping</p>
                  <span>Calculated at checkout</span>
                </div>

                <div className="cartItem-subtotal">
                  <p>Subtotal:</p>
                  <span>${(getTotalPrice() / 100).toFixed(2)}</span>
                </div>

                <div className="cartItem-total">
                  <p>Total:</p>
                  <span className="total-amount">
                    ${(getTotalPrice() / 100).toFixed(2)}
                  </span>
                </div>

                <div className="cartItem-button">
                  <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Proceed to Checkout"}
                  </button>
                </div>

                <button
                  className="continue-shopping-btn"
                  onClick={() => setShowCheckout(false)}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};