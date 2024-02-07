import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import CartBubble from "./CartBubble";

function CartButton() {
  const [showCart, setShowCart] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const { token } = useAuthContext();

  const { cartItem, anonItem } = useShoppingCart();

  //cart qty indicator handler
  useEffect(() => {
    const list = token ? cartItem : anonItem;

    const handleQty = () => {
      const calculateQty = list.reduce(
        (total, item) => item.quantity + total,
        0
      );
      return setCartQty(calculateQty);
    };

    if (list.length) {
      handleQty();
    } else {
      setCartQty(0);
    }
  }, [cartItem, anonItem]);

  function mouseEnter() {
    setShowCart(true);
  }
  function mouseLeave() {
    setShowCart(false);
  }

  return (
    <div
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      className="relative mx-2"
    >
      <Link to={"/cart"}>
        <img
          src="/svg/icon-cart.svg"
          alt="cart"
          className={`smooth-animation ${showCart && "scale-125"}`}
          onClick={mouseLeave}
        />

        {cartQty > 0 && (
          <span className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-md bg-Orange px-2 text-xs font-bold text-White">
            {cartQty}
          </span>
        )}
      </Link>

      <CartBubble showCart={showCart} />
    </div>
  );
}

export default CartButton;
