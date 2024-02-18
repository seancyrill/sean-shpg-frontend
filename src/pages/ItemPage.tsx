import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
import {
  AttributeType,
  CartItem,
  ItemInfoType,
} from "../types/ShoppingCartContextTypes";
import useCartControl from "../hooks/useCartControl";
import { useAuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatCurrency } from "../utilities/CurrencyFormater";
import { ReactSVG } from "react-svg";
import { discountedPrice } from "../utilities/discountedPrice";
import ItemImages from "../components/ItemPage/ItemPhotos";
import ItemAttrubutes from "../components/ItemPage/ItemAttrubutes";
import ItemTags from "../components/ItemPage/ItemTags";
import RatingsSection from "../components/ItemPage/RatingsSection";
import StarRating from "../components/StarRating";
import LazyBottomComponent from "../components/ItemPage/LazyBottomComponent";
import Browsing from "../components/Browsing";

export default function ItemPage() {
  const { id } = useParams();
  const { basicReq, setFetchErrModal, shop_id: userShopId } = useAuthContext();
  const { addToCart } = useCartControl();

  const [itemInfo, setItemInfo] = useState({} as ItemInfoType);
  const {
    item_id,
    item_name,
    item_price,
    shop_id,
    shop_name,
    item_desc,
    discount,
    end_date,
    start_date,
    item_imgs,
    item_default_img_id,
    item_attributes,
    item_tags,
    average_score,
    latest_reviews,
    rating_tally,
  } = itemInfo;

  const promo_valid =
    start_date !== null && end_date !== null
      ? new Date() >= new Date(start_date) && new Date() <= new Date(end_date)
      : false;
  const calculatedPrice = promo_valid
    ? discountedPrice(item_price, discount)
    : item_price;

  const [toCart, setToCart] = useState(1);
  const [option, setOption] = useState<AttributeType | null>(null);

  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const merchOwner = userShopId === shop_id;
  const howMuchFits = +(window.innerWidth / 200).toFixed() * 2;
  const suggestionCount = howMuchFits > 6 ? howMuchFits : 6;
  const suggestedFilter = () => {
    if (!item_tags.length) return item_name.split(" ").slice(0, 3);
    if (item_tags.length <= 1) return item_tags[0];

    if (item_tags[0] === "men" || "women") {
      return item_tags[1];
    }
  };

  const [isAdded, setIsAdded] = useState(false);

  const toAdd: CartItem = {
    item_id,
    quantity: toCart,
    checkout: true,
    option,
  };

  function handleAdd() {
    const addProccess = async () => {
      try {
        await addToCart([toAdd]);
        setIsAdded(true);

        setTimeout(() => {
          setIsAdded(false);
        }, 5000);
      } catch (error) {
        setFetchErrModal(true);
      }
    };

    if (!isAdded) {
      addProccess();
    }
  }

  //fetch item information
  useEffect(() => {
    const controller = new AbortController();

    async function fetchItemInfo() {
      try {
        const response = await basicReq.get(`/items/${id}`, {
          signal: controller.signal,
        });
        setItemInfo(response.data);

        //sets the first option as default option
        if (
          response?.data?.item_attributes &&
          response?.data?.item_attributes?.length
        ) {
          setOption(response?.data?.item_attributes[0]);
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

    if (id) {
      fetchItemInfo();
    }
  }, [id]);

  return (
    <>
      {success && (
        <>
          <section className="flex w-full flex-col items-center overflow-hidden rounded-b-md bg-White shadow-md md:px-24 lg:flex-row lg:gap-12 lg:py-8">
            <ItemImages
              item_imgs={item_imgs}
              item_default_img_id={item_default_img_id}
            />

            <div className="flex w-full flex-col gap-4 p-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <Link
                  to={`/shop/${shop_id}`}
                  className="text-xs font-bold tracking-widest text-Orange"
                >
                  {merchOwner ? (
                    <p>THIS ITEM IS YOUR MERCHANDISE</p>
                  ) : (
                    <p>
                      <span className="font-normal text-Grayish-blue">BY </span>
                      {shop_name.toLocaleUpperCase()}
                    </p>
                  )}
                </Link>
                <ItemTags item_tags={item_tags} />
              </div>

              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {item_name}
              </h1>
              <p className="text-Dark-grayish-blue">{item_desc}</p>

              <a className="flex items-center gap-4" href="#ratingsSection">
                <StarRating rating_score={average_score || 0} />
                <p className="text-sm text-Dark-grayish-blue">{`${
                  rating_tally?.length || 0
                } Ratings`}</p>
              </a>

              <ItemAttrubutes
                item_attributes={item_attributes}
                option={option}
                setOption={setOption}
              />

              <div className="flex items-center justify-between md:flex-col md:items-start">
                <div className="flex gap-4">
                  <h3 className="text-3xl font-bold">
                    {formatCurrency(calculatedPrice)}
                  </h3>
                  {promo_valid && (
                    <p className="rounded-lg bg-Pale-orange p-2 font-bold text-Orange">{`${discount}%`}</p>
                  )}
                </div>
                {promo_valid && (
                  <h4 className="text-xl font-bold text-Grayish-blue line-through">
                    {formatCurrency(item_price)}
                  </h4>
                )}
              </div>

              {merchOwner ? (
                <Link
                  to={`/controls/shop`}
                  className={`relative flex w-full items-center justify-center gap-4 rounded-lg bg-Orange p-6 font-bold text-White hover:opacity-50`}
                >
                  Visit your shop settings
                </Link>
              ) : (
                <>
                  <form
                    className="flex w-full flex-col gap-4 md:mt-8 xl:flex-row"
                    onSubmit={(e) => (e.preventDefault(), handleAdd())}
                  >
                    <div className="flex w-full items-center justify-between rounded-xl bg-Light-grayish-blue">
                      <ReactSVG
                        onClick={() =>
                          setToCart((prev) => (prev !== 1 ? prev - 1 : prev))
                        }
                        src="/svg/icon-minus.svg"
                        className="smooth-animation cursor-pointer fill-Orange object-contain p-6 hover:scale-125 hover:opacity-50"
                      />

                      <input
                        type="number"
                        name="toCart"
                        id="toCart"
                        value={toCart}
                        className="appearance-none bg-transparent bg-none text-center font-bold"
                        onChange={(e) => setToCart(parseInt(e.target.value))}
                      />

                      <ReactSVG
                        onClick={() => setToCart((prev) => prev + 1)}
                        src="/svg/icon-plus.svg"
                        className="smooth-animation cursor-pointer fill-Orange object-contain p-6 hover:scale-125 hover:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      className={`smooth-animation relative flex w-full items-center justify-center gap-4 rounded-lg p-6 hover:brightness-125 ${
                        isAdded ? "bg-Green" : "bg-Orange"
                      }`}
                    >
                      {isAdded && (
                        <Link
                          to={"/cart"}
                          className="absolute top-0 w-fit -translate-y-[120%] cursor-help rounded-md bg-Pale-orange p-2 text-center text-green-600"
                        >
                          Successfully added to
                          <span className="font-bold text-Orange underline">
                            {` Cart `}
                          </span>
                          ✔
                        </Link>
                      )}
                      <ReactSVG
                        src="/svg/icon-cart.svg"
                        className="fill-White"
                      />
                      <p className="whitespace-nowrap font-bold text-White">
                        Add to Cart
                      </p>
                    </button>
                  </form>
                </>
              )}
            </div>
          </section>

          {/* <section className="flex flex-col gap-8">
            <RatingsSection
              latestReviews={latest_reviews}
              ratingTally={rating_tally}
              item_id={item_id}
            />
            <LazyBottomComponent
              children={
                <Browsing
                  title={`from ${shop_name}`}
                  link={`/shop/${shop_id}`}
                  count={suggestionCount}
                  shop_id={shop_id}
                  newTab={true}
                />
              }
            />
            <LazyBottomComponent
              children={
                <Browsing
                  title="you may also like"
                  link={`/search/${suggestedFilter()}`}
                  count={suggestionCount}
                  nextBatch={true}
                  filter={item_tags[0]}
                  newTab={true}
                />
              }
            />
          </section> */}
        </>
      )}

      <LoadingSpinner loading={isLoading} />
    </>
  );
}
``;
