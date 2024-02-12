import { isAxiosError } from "axios";
import { useState, useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ItemInfoType } from "../../types/ShoppingCartContextTypes";
import { ShopInfoType } from "../ShopPage";

type useShopContextType = {
  shopInfo: ShopInfoType;
  shopLoading: boolean;
  setShopLoading: React.Dispatch<React.SetStateAction<boolean>>;
  shopItems: ItemInfoType[];
  setShopItems: React.Dispatch<React.SetStateAction<ItemInfoType[]>>;
};

export function useShopContext() {
  return useOutletContext<useShopContextType>();
}

function UserShop() {
  const { shop_id, privateReq, setFetchErrModal } = useAuthContext();

  const [shopLoading, setShopLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [shopInfo, setShopInfo] = useState({} as ShopInfoType);
  const [shopItems, setShopItems] = useState([] as ItemInfoType[]);

  const navigate = useNavigate();
  const location = useLocation();

  async function fetchShopInfo(signal: AbortSignal) {
    console.log();
    if (!shop_id) return;
    try {
      const response = await privateReq.get("/shops/private", {
        signal,
        params: {
          shop_id,
        },
      });
      setShopInfo(response.data?.shopInfo);
      setShopItems(response.data?.shopItems);
      setSuccess(true);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
      setSuccess(false);
      setFetchErrModal(true);
    } finally {
      setShopLoading(false);
    }
  }

  //set data for shop AND items being sold
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (!shop_id) {
      navigate("/controls/newshop");
    }

    fetchShopInfo(signal);

    return () => {
      controller.abort();
    };
  }, [shop_id]);
  //refetch on shop page reload
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (location.pathname.endsWith("controls/shop")) fetchShopInfo(signal);

    return () => {
      controller.abort();
    };
  }, [location.pathname]);

  return (
    <>
      <LoadingSpinner loading={shopLoading} />
      {success && (
        <Outlet
          context={{
            shopInfo,
            shopLoading,
            setShopLoading,
            shopItems,
            setShopItems,
          }}
        />
      )}
    </>
  );
}

export default UserShop;
