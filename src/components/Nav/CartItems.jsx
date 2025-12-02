import "./CartItems.css";

export const CheckoutPage = ({ showCheckout, setShowCheckout }) => {
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
            <p>cart item is empty</p>
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
