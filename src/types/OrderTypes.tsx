import { userAddressObjType } from "./AddressType";
import { CartItemInfoType } from "./ShoppingCartContextTypes";

export type OrderItemType = CartItemInfoType & {
  discounted: number;
  calculatedPrice: number;
  inPromo: boolean;
};

export type OrdersDataType = {
  order_id: number;
  user_id: number;
  order_items: OrderItemType[];
  order_address: userAddressObjType;
  order_date: string;
};
