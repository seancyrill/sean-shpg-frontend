import { ItemBubbleInfoType } from "../types/ShoppingCartContextTypes";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utilities/CurrencyFormater";
import { discountedPrice } from "../utilities/discountedPrice";
import logo from "/images/icon-logo.png";
import StarRating from "./StarRating";

type ItemBubbleType = {
  item: ItemBubbleInfoType;
  newTab?: boolean;
};

function ItemBubble({ item, newTab }: ItemBubbleType) {
  const {
    item_id,
    item_name,
    item_price,
    discount,
    end_date,
    start_date,
    thumbnail_url,
    average_score,
  } = item;
  const imgDisplay = thumbnail_url || logo;
  const promo_valid =
    start_date !== null && end_date !== null
      ? new Date() >= new Date(start_date) && new Date() <= new Date(end_date)
      : false;
  const calculatedPrice = promo_valid
    ? discountedPrice(item_price, discount)
    : item_price;

  return (
    <Link
      to={`/item/${item_id}`}
      target={newTab ? "_blank" : ""}
      className="smooth-animation group mx-auto flex h-[304px] w-[200px] flex-col overflow-hidden rounded-xl bg-White shadow-lg hover:scale-95 hover:opacity-95"
    >
      <div className="grid h-[200px] w-[200px] place-content-center overflow-hidden bg-Light-grayish-blue">
        <img
          src={imgDisplay}
          alt="productImg"
          className="w-full object-cover"
        />
      </div>

      <div className="h-fit max-h-[104px] px-4 py-2 capitalize">
        <h1 className="h-12 text-left group-hover:text-Orange">
          {item_name
            ? item_name.length > 30
              ? `${item_name.slice(0, 30)}...`
              : item_name
            : "Product name"}
        </h1>

        <StarRating rating_score={average_score || 0} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{formatCurrency(calculatedPrice)}</h3>
            {promo_valid && (
              <p className="rounded-lg bg-Pale-orange p-1 text-xs text-Orange">{`${discount}%`}</p>
            )}
          </div>
          {promo_valid && (
            <h4 className="text-sm text-Grayish-blue line-through">
              {formatCurrency(item_price)}
            </h4>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ItemBubble;
