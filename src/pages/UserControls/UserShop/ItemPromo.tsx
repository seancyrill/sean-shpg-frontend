import { useNavigate } from "react-router-dom";
import PromoForm from "../../../components/UserShop/PromoForm";
import { ReactSVG } from "react-svg";
import { useEffect } from "react";
import { useShopContext } from "../UserShop";

function ItemPromo() {
  const { shopItems } = useShopContext();

  const navigate = useNavigate();
  function backToShop() {
    navigate("/controls/shop");
  }

  useEffect(() => {
    if (!shopItems.length) {
      backToShop();
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b p-8">
        <h1 className="text-2xl font-bold">Item Promo</h1>
        <div>
          <ReactSVG
            src="/svg/icon-close.svg"
            className="cursor-pointer fill-Red p-2 hover:scale-110"
            onClick={backToShop}
          />
        </div>
      </div>

      <PromoForm backToShop={backToShop} />
    </div>
  );
}

export default ItemPromo;
