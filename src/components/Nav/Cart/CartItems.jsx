import "./CartItems.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Cart/UseCart";
import emptyCart from "../../../../public/images/empty-cart.png";

export const CheckoutPage = ({ showCheckout, setShowCheckout }) => {
  useEffect(() => {
    if (showCheckout) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [showCheckout]);

  const { cartItems, removeFromCart, getTotalPrice, updateQuantity } =
    useCart();


  return (
    <>
      {/* CHECKOUT POPUP */}
      {showCheckout && (
        <div
          className="popup-content-cart"
          onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
        >
              <div className="cartItem-top">
                <h2>Your Cart</h2>

                <button onClick={() => setShowCheckout(false)}>X</button>
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
                      to="/"
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

                          <button onClick={() => removeFromCart(item.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="cartItem-bottom">
                {/* {cartItems.map((item) => { */}
                {/* <> */}
                <div className="cartItem-shipping">
                  <p>shipping</p>
                  <span>At checkout</span>
                </div>

                <div className="cartItem-total">
                  <p>Total:</p>
                  <span>{(getTotalPrice() / 100).toFixed(2)}</span>
                </div>

                <div className="cartItem-button">
                  <button>checkout</button>
                </div>
                {/* </>; */}
                {/* })} */}
              </div>
        </div>
      )}
    </>
  );
};
