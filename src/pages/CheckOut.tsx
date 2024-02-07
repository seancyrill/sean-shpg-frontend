import { useEffect, useState } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import CheckOutAddress from "../components/Checkout/CheckOutAddress";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { isAxiosError } from "axios";
import useCartControl from "../hooks/useCartControl";
import OrderItemBubble from "../components/UserInfo/OrderItemBubble";
import { formatCurrency } from "../utilities/CurrencyFormater";
import { discountedPrice } from "../utilities/discountedPrice";
import { OrderItemType } from "../types/OrderTypes";
import { userAddressObjType } from "./UserControls/UserInfo/Addresses";

function CheckOut() {
  const { privateReq, user_id } = useAuthContext();
  const { selectedInCart } = useShoppingCart();
  const { deleteInCart } = useCartControl();
  const [selectedAddress, setSelectedAddress] =
    useState<userAddressObjType | null>(null);
  const navigate = useNavigate();

  const shippingCost = 0;

  const orderItems: OrderItemType[] = selectedInCart.map((item) => {
    const { start_date, end_date, item_price, discount } = item;
    const inPromo =
      start_date !== null && end_date !== null
        ? new Date() >= new Date(start_date) && new Date() <= new Date(end_date)
        : false;
    const calculatedPrice = inPromo
      ? discountedPrice(item_price, discount)
      : item_price;
    const discounted = inPromo ? item_price - calculatedPrice : 0;

    return { ...item, calculatedPrice, inPromo, discounted };
  });

  const totalMerchCost = orderItems.reduce(
    (accumulator, { item_price, quantity }) => {
      return item_price * quantity + accumulator;
    },
    0
  );

  const totalItemCount = orderItems.reduce((accumulator, { quantity }) => {
    return quantity + accumulator;
  }, 0);

  const totalDiscounted = orderItems.reduce(
    (accumulator, { discounted, quantity }) => {
      return discounted * quantity + accumulator;
    },
    0
  );

  const totalCost = totalMerchCost - totalDiscounted + shippingCost;

  const disablePlacingOrder = !selectedAddress?.address_id;

  async function handleCheckOut() {
    try {
      await privateReq.post("/orders", {
        user_id,
        orderItems,
        selectedAddress,
      });
      deleteInCart(selectedInCart);
      navigate("/controls/user/orders"); //navigate to orders to show success
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    }
  }

  //// navigate back to cart if no item is selected ////
  useEffect(() => {
    if (!selectedInCart.length) {
      navigate("/cart", { replace: true });
    }
  }, [selectedInCart]);

  return (
    <div className="m-2 flex flex-1 flex-col gap-1 rounded-md">
      <h1 className="border-b bg-White p-6 text-2xl font-bold shadow-md">
        Checkout
      </h1>

      <CheckOutAddress
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />

      <div className="rounded-md bg-White shadow-md">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Products Ordered</h2>
          <div>
            <p className="text-right font-bold">{formatCurrency(totalCost)}</p>
            <p className="text-right">{`${totalItemCount} Item${
              totalItemCount > 1 ? "s" : ""
            }`}</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1 p-1">
          {orderItems.map((item, i) => (
            <div className="flex" key={i}>
              <OrderItemBubble item={item} />
              <p className="grid min-w-[80px] place-content-center border p-2 shadow-inner">
                {formatCurrency(item.calculatedPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto min-w-[340px] max-w-sm rounded-md border bg-White shadow-md">
        <div className="p-4">
          <p className="flex items-center justify-between gap-4">
            <span>Merchandise Subtotal:</span>
            <span>{formatCurrency(totalMerchCost)}</span>
          </p>
          <p className="flex items-center justify-between gap-4 text-Orange">
            <span>Discount Subtotal:</span>
            <span>{`-${formatCurrency(totalDiscounted)}`}</span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span>Shipping Cost:</span>
            <span>{formatCurrency(shippingCost)}</span>
          </p>
          <p className="flex items-center justify-between gap-4 border-t pt-1 text-lg font-bold text-Orange">
            <span>Total:</span>
            <span>{formatCurrency(totalCost)}</span>
          </p>
        </div>
        <button
          onClick={(e) => (e.preventDefault(), handleCheckOut())}
          className="primary-button w-full font-bold uppercase disabled:blur-sm disabled:saturate-0 disabled:hover:scale-100"
          disabled={disablePlacingOrder}
        >
          Place order
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
