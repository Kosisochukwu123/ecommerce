import "./CartItems.css";
import { useEffect } from "react";
import hoodie from "../../../images/Top-Piece2.png";


export const CheckoutPage = ({ showCheckout, setShowCheckout }) => {
  useEffect(() => {
    if (showCheckout) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [showCheckout]);


  
  return (
    <>
      {/* CHECKOUT POPUP */}
      {showCheckout && (
          <div className="popup-content-cart"
            onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
          >
            <div className="cartItem-top">
              <h2>Your Cart</h2>

              <button onClick={() => setShowCheckout(false)}>X</button>
            </div>

            <div className="cartItem-body">

              <div className="cartItem-container">
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
              </div>

              <div className="cartItem-container">
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
              </div>

              <div className="cartItem-container">
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
              </div>

              <div className="cartItem-container">
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
              </div>

              <div className="cartItem-container">
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
              </div>

              <div className="cartItem-container">
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
              </div>
              
            </div>

            <div className="cartItem-bottom">
              <div className="cartItem-shipping">
                <p>shipping</p>
                <span>At checkout</span>
              </div>

              <div className="cartItem-total">
                <p>Total</p>
                <span>$0</span>
              </div>

              <div className="cartItem-button">
                <button>checkout</button>
              </div>
            </div>
            
          </div>
      )}
    </>
  );
};
