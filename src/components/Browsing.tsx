import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import ItemBubble from "./ItemBubble";
import { ItemBubbleInfoType } from "../types/ShoppingCartContextTypes";
import LoadingSpinnerInline from "./UserShop/LoadingSpinnerInline";
import { Link } from "react-router-dom";

type BrowsingType = {
  title?: string;
  link?: string;
  filter?: string;
  shop_id?: number;
  count?: number;
  nextBatch?: boolean;
  newTab?: boolean;
  horizontal?: boolean;
};

export default function Browsing({
  title,
  link,
  filter,
  shop_id,
  count = 50,
  nextBatch,
  newTab,
  horizontal,
}: BrowsingType) {
  const [items, setItems] = useState([] as ItemBubbleInfoType[]);
  const { basicReq, setFetchErrModal } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const [offset, setOffset] = useState(0);
  const [itemsCountMaxed, setItemsCountMaxed] = useState(false);

  const nextBatchLoader = useRef<HTMLDivElement | null>(null);

  //root fetch function
  async function fetchItems(controller: AbortController) {
    if (itemsCountMaxed) return;
    try {
      const response = await basicReq.get(
        `/items${filter ? `/search/${filter}` : ""}`,
        {
          signal: controller.signal,
          params: {
            offset,
            limit: count,
            shop_id,
          },
        }
      );
      const { items: newItems, totalCount } = response.data;
      setItems((prevItems) =>
        offset === 0 ? newItems : [...prevItems, ...newItems]
      );
      setItemsCountMaxed(offset + count >= totalCount);
      setOffset((prev) => prev + count);
    } catch (error) {
      if (axios.isAxiosError(error)) {
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

  //resets when search query is changed
  useEffect(() => {
    setOffset(0);
    setItemsCountMaxed(false);
  }, [filter]);

  //fetch initial items
  useEffect(() => {
    const controller = new AbortController();
    if (offset === 0 && !itemsCountMaxed) fetchItems(controller);
    return () => {
      controller.abort();
    };
  }, [filter, offset, itemsCountMaxed]);

  //fetching next batch
  useEffect(() => {
    if (!nextBatch) return;
    const controller = new AbortController();

    const handleScroll = () => {
      if (
        nextBatchLoader.current &&
        window.innerHeight + window.scrollY >=
          nextBatchLoader.current.offsetTop - 300
      ) {
        fetchItems(controller);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      controller.abort();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset, filter]);

  return (
    <div>
      {items?.length ? (
        <>
          {title && link && (
            <Link
              to={link}
              className="smooth-animation z-10 flex w-full border-b border-Very-dark-blue bg-Very-dark-blue bg-opacity-90 p-4 text-3xl font-bold uppercase text-White shadow-lg hover:text-Orange"
              target="_blank"
            >
              {title}
            </Link>
          )}
          <div
            className={`m-4 gap-4 ${
              horizontal
                ? "flex flex-1 flex-row overflow-auto"
                : "grid-auto grid"
            }`}
          >
            {items.map((item, i) => (
              <div key={i}>
                <ItemBubble item={item} newTab={newTab} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="m-auto p-8 text-center">
          No items matched your search
        </div>
      )}

      <div ref={nextBatchLoader} />
      <LoadingSpinnerInline loading={isLoading} />
    </div>
  );
}
