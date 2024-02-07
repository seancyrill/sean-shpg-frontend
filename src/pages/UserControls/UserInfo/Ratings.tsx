import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { OrdersDataType } from "../../../types/OrderTypes";
import { isAxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
import ItemBubble from "../../../components/ItemBubble";
import RatingForm, {
  RatingType,
} from "../../../components/UserInfo/RatingForm";
import LoadingSpinner from "../../../components/LoadingSpinner";
import logo from "/images/icon-logo.png";
import RatingBubble from "../../../components/ItemPage/RatingBubble";

function Ratings() {
  const { order_id } = useParams();
  const { privateReq, user_id, setFetchErrModal } = useAuthContext();
  const [ordersData, setOrdersData] = useState({} as OrdersDataType);
  const [ratings, setRatings] = useState<RatingType[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [itemIndex, setItemIndex] = useState<number>(0);

  //// fetch data ////
  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrdersData() {
      try {
        const orderQuery = await privateReq.get(`/orders/${order_id}`, {
          signal: controller.signal,
          params: {
            user_id,
          },
        });
        const orders: OrdersDataType = orderQuery.data;
        setOrdersData(orders);

        const id_list =
          orders?.order_items?.map(({ item_id }) => item_id) || [];

        if (id_list.length) {
          const ratedQuery = await privateReq.get(`/ratings/orders`, {
            signal: controller.signal,
            params: {
              user_id,
              id_list,
            },
          });
          setRatings(ratedQuery.data);
        }

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
        <div className="flex-1 overflow-hidden bg-Light-grayish-blue">
          <div className="flex items-center justify-between border-b bg-White p-2">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">{`#${order_id}`}</h1>
              <p>{ordersData.order_items.length} items</p>
            </div>
            <Link
              to={"/controls/user/orders"}
              className="secondary-button text-Soft-Red"
            >
              Cancel
            </Link>
          </div>
          <div className="flex h-full flex-col gap-1">
            {ordersData.order_items.map((item, i) => {
              const findRating = ratings?.find(
                ({ item_id }) => item_id === item.item_id
              );
              return (
                <article
                  className="flex flex-col items-center justify-between border bg-Light-grayish-blue shadow-inner md:flex-row"
                  key={i}
                >
                  {i === itemIndex ? (
                    <>
                      <div className="w-full flex-1 p-2">
                        <ItemBubble item={item} newTab={true} />
                      </div>
                      <div>
                        {findRating ? (
                          <RatingBubble rating={findRating} />
                        ) : (
                          <RatingForm item_id={item.item_id} />
                        )}
                      </div>
                    </>
                  ) : (
                    <div
                      className="flex w-full items-center justify-between gap-4 bg-White p-4"
                      onClick={() => setItemIndex(i)}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.img_url || logo}
                          alt="itemImg"
                          className="m-auto max-h-[60px] max-w-[60px]"
                        />
                        <span className="font-bold">{item.item_name}</span>
                        <span className="whitespace-nowrap">{` x ${item.quantity}`}</span>
                      </div>
                      {findRating ? (
                        <button className="secondary-button whitespace-nowrap text-White">
                          View
                        </button>
                      ) : (
                        <button className="primary-button whitespace-nowrap">
                          Rate now
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Ratings;
