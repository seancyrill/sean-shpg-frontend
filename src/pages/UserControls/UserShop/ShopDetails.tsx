import { Link } from "react-router-dom";
import { useShopContext } from "../UserShop";
import DeleteMerch from "../../../components/UserShop/DeleteMerch";
import ItemBubble from "../../../components/ItemBubble";
import EditMerchBtn from "../../../components/UserShop/EditMerchBtn";
import { ReactSVG } from "react-svg";
import ItemPromoBtn from "../../../components/UserShop/ItemPromoBtn";
import { useAuthContext } from "../../../context/AuthContext";
import logo from "/images/icon-logo.png";
import ShopHeader from "../../../components/UserShop/ShopHeader";

function ShopDetails() {
  const { shop_default_img } = useAuthContext();
  const { shopItems, shopInfo } = useShopContext();

  const shopImg = shop_default_img ? shop_default_img?.img_url : logo;

  return (
    <div>
      <Link
        to={"/controls/shop/settings"}
        className="flex items-center gap-4 p-4"
      >
        <ShopHeader shopInfo={shopInfo} defaultImgUrl={shopImg} />
        <div className="smooth-animation -m-2 px-4 py-2 hover:scale-125 hover:brightness-125">
          <ReactSVG src="/svg/icon-edit.svg" className="fill-Orange" />
        </div>
      </Link>

      <div>
        <div className="flex items-center justify-between border-y p-4">
          <p className="font-bold">{`${shopItems.length} Product${
            shopItems.length > 1 ? "s" : ""
          }`}</p>
          <Link
            to={"/controls/shop/newitem"}
            className="primary-button flex items-center gap-2"
          >
            <ReactSVG src="/svg/icon-plus.svg" className="fill-current" />
            Add new product
          </Link>
        </div>
        <div className="grid-auto-lg grid gap-4 p-2">
          {!shopItems.length && (
            <h1 className="border px-2 py-4 text-center shadow-inner">
              You have no items for sale
            </h1>
          )}
          {shopItems.map((item, i) => (
            <div
              className="relative m-auto flex flex-col gap-3 border-[1px] p-3 shadow-inner md:flex-row"
              key={i}
            >
              <ItemBubble item={item} newTab={true} />
              <div className="flex flex-row items-end justify-between gap-2 md:flex-col">
                <div className="flex flex-col gap-2">
                  <EditMerchBtn item_id={item.item_id} />
                  <ItemPromoBtn item_id={item.item_id} />
                </div>
                <DeleteMerch item_id={item.item_id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopDetails;
