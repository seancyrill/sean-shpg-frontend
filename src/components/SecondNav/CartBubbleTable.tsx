import { CartItemInfoType } from "../../types/ShoppingCartContextTypes";
import CartBubbleCell from "./CartBubbleCell";

type CartBubbleTableType = {
  items: CartItemInfoType[];
};

function CartBubbleTable({ items }: CartBubbleTableType) {
  return (
    <div>
      {!items.length && (
        <p className="m-4 grid place-content-center font-bold text-Dark-grayish-blue">
          Your cart is empty.
        </p>
      )}

      {items.map((item, i) => {
        return <CartBubbleCell item={item} key={i} />;
      })}
    </div>
  );
}

export default CartBubbleTable;
