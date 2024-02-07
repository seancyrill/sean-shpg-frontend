import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthContext } from "../context/AuthContext";
import ShopHeader from "../components/UserShop/ShopHeader";
import Browsing from "../components/Browsing";

export type ShopInfoType = {
  shop_id: number;
  shop_name: string;
  shop_email: string;
  shop_default_img_id: number | null;
  default_img_url: string | null;
  item_count: number;
};

type ShopPageType = {
  specificId?: number;
  limit?: number;
};

function ShopPage({ specificId, limit = 20 }: ShopPageType) {
  const { id } = useParams();
  const shop_id = Number.isNaN(Number(id)) ? specificId : Number(id);

  const { basicReq } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState<ShopInfoType | null>(null);

  const navigate = useNavigate();

  //set shop data AND items being sold
  useEffect(() => {
    async function fetchShopInfo() {
      try {
        const response = await basicReq.get("/shops", {
          params: {
            shop_id,
          },
        });
        setShopInfo(response.data);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.data?.message === "shop does not exist") {
            navigate("/notfound", { replace: true });
          }
          console.error(error.response?.data);
        } else {
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (shop_id) {
      fetchShopInfo();
    }
  }, [shop_id]);

  return (
    <>
      {shopInfo && (
        <section className="m-2 rounded-md bg-White shadow-md">
          <div className="flex items-center gap-4 bg-White p-4 ">
            <ShopHeader
              shopInfo={shopInfo}
              defaultImgUrl={shopInfo.default_img_url || undefined}
            />
          </div>

          {shop_id && (
            <div>
              <div className="flex items-center justify-between border-y p-4">
                <p className="font-bold">{`${shopInfo.item_count} Product${
                  shopInfo.item_count > 1 ? "s" : ""
                }`}</p>
              </div>
              <div className="p-2">
                <div className="grid-auto grid border bg-Light-grayish-blue shadow-inner">
                  <Browsing count={limit} shop_id={shop_id} />
                </div>
              </div>
            </div>
          )}
        </section>
      )}
      <LoadingSpinner loading={isLoading} />
    </>
  );
}

export default ShopPage;
