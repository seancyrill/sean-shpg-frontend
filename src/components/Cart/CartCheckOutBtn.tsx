import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { formatCurrency } from "../../utilities/CurrencyFormater";

function CartCheckOutBtn() {
  const { token } = useAuthContext();
  const { selectedInCart, totalCost } = useShoppingCart();
  const totalItemCount = selectedInCart.reduce((accumulator, { quantity }) => {
    return quantity + accumulator;
  }, 0);

  return (
    <>
      {selectedInCart.length > 0 && (
        <div className="flex flex-col gap-2 px-2">
          <p>
            {`Total (`}
            <span className="font-bold">{totalItemCount}</span>
            {` Items): `}
            <span className="font-bold text-Orange">
              {formatCurrency(totalCost)}
            </span>
          </p>
          <Link
            to={token ? "/registrar/checkout" : "/registrar/register"}
            replace
            state={"/registrar/checkout"}
            className="primary-button"
          >
            Proceed to checkout
          </Link>
        </div>
      )}
    </>
  );
}

export default CartCheckOutBtn;
