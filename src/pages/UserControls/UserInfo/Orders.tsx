import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import OrderBubble from "../../../components/UserInfo/OrderBubble";
import DeleteOrder from "../../../components/UserInfo/DeleteOrder";
import { OrdersDataType } from "../../../types/OrderTypes";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

function Orders() {
  const { privateReq, user_id, setFetchErrModal } = useAuthContext();
  const [ordersData, setOrdersData] = useState([] as OrdersDataType[]);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  //// fetch data ////
  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrdersData() {
      try {
        const response = await privateReq.get("/orders", {
          signal: controller.signal,
          params: {
            user_id,
          },
        });
        setOrdersData(response.data);
        setSuccess(true);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.config?.signal?.aborted) return;
          console.error(error.response?.data);
        } else {
          console.error(error);
        }
        setFetchErrModal(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (user_id) {
      fetchOrdersData();
    }

    return () => {
      controller.abort();
    };
  }, [user_id]);

  return (
    <>
      <LoadingSpinner loading={isLoading} />

      {success && (
        <div className="flex flex-1 flex-col-reverse justify-end gap-4 bg-Light-grayish-blue">
          {!ordersData.length && (
            <p className="rounded-md bg-White p-4 text-center shadow-md">
              No orders
            </p>
          )}
          {ordersData.map((order, i) => (
            <article
              key={i}
              className="flex justify-between bg-White text-center shadow-md"
            >
              <OrderBubble order={order} />
              <div className="flex flex-col-reverse border-l md:flex-col">
                <Link
                  to={`/controls/user/ratings/${order.order_id}`}
                  className="primary-button flex flex-col items-center px-2"
                >
                  <ReactSVG
                    src="/svg/icon-star-empty.svg"
                    className="fill-current"
                  />
                  Rate
                </Link>
                <DeleteOrder
                  order_id={order.order_id}
                  setIsLoading={setIsLoading}
                  setOrdersData={setOrdersData}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
export default Orders;
