import { CartItemInfoType } from "../../types/ShoppingCartContextTypes";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utilities/CurrencyFormater";
import useCartControl from "../../hooks/useCartControl";
import { ReactSVG } from "react-svg";
import { useAuthContext } from "../../context/AuthContext";
import { discountedPrice } from "../../utilities/discountedPrice";
import logo from "/images/icon-logo.png";

type CartBubbleCellType = {
  item: CartItemInfoType;
};

function CartBubbleCell({ item }: CartBubbleCellType) {
  const { setFetchErrModal } = useAuthContext();
  const { deleteInCart } = useCartControl();
  const {
    item_price,
    item_name,
    quantity,
    item_id,
    end_date,
    discount,
    start_date,
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

  async function handleDelete() {
    try {
      await deleteInCart([item]);
    } catch (error) {
      setFetchErrModal(true);
    }
  }

  return (
    <div className="relative mb-4 flex cursor-default items-center gap-x-4">
      <img
        src={thumbnail_url || logo}
        alt="itemImage"
        className="max-w-[70px] object-contain"
      />

      <div className="flex-1">
        <Link
          to={`/item/${item_id}`}
          className="col-start-2 col-end-4 cursor-pointer hover:opacity-50"
        >
          <p className="">{item_name}</p>
          {option && (
            <p className="text-xs text-Dark-grayish-blue">{`${option.attribute_name}: ${option.attribute_value}`}</p>
          )}
        </Link>
        <p className="flex gap-2 whitespace-nowrap">
          {`${quantity} x `}
          <span className="flex gap-2">
            <span className="font-bold">{formatCurrency(calculatedPrice)}</span>
            {promo_valid && (
              <span className="text-Grayish-blue line-through">
                {formatCurrency(item_price)}
              </span>
            )}
          </span>
        </p>
      </div>

      <ReactSVG
        onClick={handleDelete}
        src="/svg/icon-delete.svg"
        className="smooth-animation cursor-pointer pl-4 hover:scale-125 hover:fill-Red"
      />
    </div>
  );
}

export default CartBubbleCell;
