import { Link } from "react-router-dom";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import CartBubbleTable from "./CartBubbleTable";
import { formatCurrency } from "../../utilities/CurrencyFormater";

type CartBubbleType = {
  showCart: boolean;
};

export default function CartBubble({ showCart }: CartBubbleType) {
  const { cart, totalCost } = useShoppingCart();

  return (
    <section
      className={`smooth-animation absolute bottom-0 right-0 flex max-h-[600px] min-w-[300px] origin-top-right translate-y-full flex-col rounded-xl bg-White shadow-2xl ${
        !showCart && "scale-0"
      }`}
    >
      <div className=" flex w-full justify-between border-b-[1px] border-b-Grayish-blue p-2">
        <h1 className="p-2">Cart</h1>

        {cart.length > 0 && (
          <p className="rounded-md bg-Pale-orange p-2 font-bold text-Orange ">{`Total: ${formatCurrency(
            totalCost
          )}`}</p>
        )}
      </div>

      <div className="flex-grow overflow-auto p-4">
        <CartBubbleTable items={cart} />

        {cart.length > 0 && (
          <Link
            to={"/cart"}
            className="block w-full rounded-lg bg-Orange p-4 text-center font-bold text-White hover:bg-Orange/50"
          >
            Show Cart
          </Link>
        )}
      </div>
    </section>
  );
}
