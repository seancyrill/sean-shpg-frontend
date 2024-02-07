import { CartItemInfoType } from "../../types/ShoppingCartContextTypes";
import CartCell from "./CartCell";

type CartTableType = {
  items: CartItemInfoType[];
};

function CartTable({ items }: CartTableType) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {!items.length ? (
        <p className="p-4 text-center">Your cart is empty.</p>
      ) : (
        <>
          {items.map((item, i) => {
            return <CartCell item={item} key={i} />;
          })}
        </>
      )}
    </div>
  );
}

export default CartTable;
