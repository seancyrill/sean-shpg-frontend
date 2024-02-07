import { CartItemInfoType } from "../../types/ShoppingCartContextTypes";
import CartItemQty from "./CartItemQty";
import { formatCurrency } from "../../utilities/CurrencyFormater";
import { Link } from "react-router-dom";
import DeleteFromCart from "./DeleteFromCart";
import SelectFromCart from "./SelectFromCart";
import { discountedPrice } from "../../utilities/discountedPrice";
import logo from "/images/icon-logo.png";

type CartCellType = {
  item: CartItemInfoType;
};

function CartCell({ item }: CartCellType) {
  const {
    item_name,
    item_price,
    item_id,
    quantity,
    checkout,
    end_date,
    start_date,
    discount,
    thumbnail_url,
    option,
  } = item;
  const promo_valid =
    start_date !== null && end_date !== null
      ? new Date() >= new Date(start_date) && new Date() <= new Date(end_date)
      : false;
  const calculatedPrice = promo_valid
    ? discountedPrice(item_price, discount)
    : item_price;
  const totalPrice = calculatedPrice * quantity;

  return (
    <article className="flex items-center justify-between border shadow-inner">
      <div className="flex flex-col gap-4 border-r p-1">
        <SelectFromCart item={item} />
        <DeleteFromCart item={item} />
      </div>
      <div className="flex flex-1 items-center gap-4 p-4">
        <div className="flex">
          <img
            src={thumbnail_url || logo}
            alt={item_name}
            className="m-auto max-w-[120px]"
          />
        </div>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row">
          <Link
            className="smooth-animation w-full text-center"
            to={`/item/${item_id}`}
            target="_blank"
          >
            <p className="font-bold hover:text-Orange">{item_name}</p>
            {option && (
              <p className="text-Dark-grayish-blue">{`${option.attribute_name}: ${option.attribute_value}`}</p>
            )}
          </Link>

          <p className="flex min-w-[120px] gap-2">
            {promo_valid && (
              <span className="w-full text-center">
                {formatCurrency(calculatedPrice)}
              </span>
            )}
            <span
              className={`w-full text-center ${
                promo_valid && "text-Grayish-blue line-through"
              }`}
            >
              {formatCurrency(item_price)}
            </span>
          </p>

          <CartItemQty
            item_id={item_id}
            quantity={quantity}
            checkout={checkout}
          />
          <p className="w-full text-center font-bold">
            {formatCurrency(totalPrice)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default CartCell;
