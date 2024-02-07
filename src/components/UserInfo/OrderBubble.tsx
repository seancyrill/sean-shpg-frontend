import { OrdersDataType } from "../../types/OrderTypes";
import { formatCurrency } from "../../utilities/CurrencyFormater";
import formatDateTime from "../../utilities/formatDateTime";
import OrderItemBubble from "./OrderItemBubble";

type OrderBubbleType = {
  order: OrdersDataType;
};

function OrderBubble({ order }: OrderBubbleType) {
  const { order_address, order_date, order_id, order_items } = order;
  const { address_number, address_postal, address_region, address_street } =
    order_address;
  const addressString = `${address_region}, ${address_street}, ${address_postal}`;
  const totalCost = order.order_items.reduce(
    (accumulator, { calculatedPrice, quantity }) => {
      return calculatedPrice * quantity + accumulator;
    },
    0
  );

  const totalItemCount = order.order_items.reduce(
    (accumulator, { quantity }) => {
      return quantity + accumulator;
    },
    0
  );

  const localOrderDate = formatDateTime(new Date(order_date));

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full items-start justify-between gap-4 border-b p-2">
        <div className="text-left">
          <p className="font-bold">{`${localOrderDate} #${order_id}`}</p>
          <p className="capitalize">{addressString}</p>
          <p className="capitalize">{address_number}</p>
        </div>
        <div>
          <p className="text-right font-bold text-Orange">
            {formatCurrency(totalCost)}
          </p>
          <p className="text-right">{`${totalItemCount} Item${
            totalItemCount > 1 ? "s" : ""
          }`}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-1 p-1">
        {order_items.map((item, i) => (
          <OrderItemBubble item={item} key={i} />
        ))}
      </div>
    </div>
  );
}

export default OrderBubble;
