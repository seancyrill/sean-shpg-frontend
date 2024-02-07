import { Link } from "react-router-dom";
import { formatCurrency } from "../../utilities/CurrencyFormater";
import { OrderItemType } from "../../types/OrderTypes";
import logo from "/images/icon-logo.png";

type OrderItemBubbleType = {
  item: OrderItemType;
};

function OrderItemBubble({ item }: OrderItemBubbleType) {
  const {
    item_id,
    item_name,
    item_price,
    quantity,
    shop_id,
    shop_name,
    calculatedPrice,
    inPromo,
    thumbnail_url,
    option,
  } = item;

  return (
    <div className="flex flex-1 items-center gap-4 border p-1 shadow-inner">
      <div className="grid h-full place-content-center">
        <img
          src={thumbnail_url || logo}
          alt={item_name}
          className="max-h-[50px] max-w-[85px]"
        />
      </div>
      <div className="flex flex-1 flex-col text-left">
        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
          <Link
            to={`/item/${item_id}`}
            className="flex flex-col gap-1 md:flex-row"
          >
            <p className="font-bold">{item_name}</p>
            {option && (
              <p className="text-Dark-grayish-blue">{`(${option.attribute_name}: ${option.attribute_value})`}</p>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-sm font-thin">{` by `}</p>
            <Link
              to={`/shop/${shop_id}`}
              className="capitalize text-Dark-grayish-blue"
            >
              {shop_name}
            </Link>
          </div>
        </div>
        <p className="flex gap-2 text-left">
          <span>{quantity}</span>
          <span>x</span>
          <span>{formatCurrency(calculatedPrice)}</span>
          {inPromo && (
            <span className="text-Grayish-blue line-through">
              {formatCurrency(item_price)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default OrderItemBubble;
