import "./CartItems.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Cart/UseCart";

export const CheckoutPage = ({ showCheckout, setShowCheckout, children }) => {
  useEffect(() => {
    if (showCheckout) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [showCheckout]);

  const { cartItems, removeFromCart, getTotalPrice, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/">Continue Shopping</Link>
      </div>
    );
  }

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
            {cartItems.map((item) => (
              <div key={item.id} className="cartItem-container">
                <div className="cartItem-image">
                  <img
                     src={`${import.meta.env.BASE_URL}${item.image}`} 
                  />
               </div>

                <div className="cartItem-content">
                  <div className="cartItem-content-top">
                    <p>{item.name}</p>
                    <span>${(item.priceCents / 100).toFixed(2)}</span>
                  </div>

                  <div className="cartItem-content-b`ottom">
                    <div>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* <div className="cartItem-container">
              <div className="cartItem-image">
                <img src={hoodie} alt="" srcset="" />
              </div>

              <div className="cartItem-content">
                <div className="cartItem-content-top">
                  <p>Americana di na hoddie</p>
                  <span>$0</span>
                </div>

                <div className="cartItem-content-bottom">
                  <p>quantity: 0</p>
                  <button>X</button>
                </div>
              </div>
            </div> */}
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
