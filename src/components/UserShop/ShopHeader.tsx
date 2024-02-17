import { ShopInfoType } from "../../pages/ShopPage";
import logo from "/images/icon-logo.png";

type ShopHeaderType = {
  shopInfo: ShopInfoType;
  defaultImgUrl: string | undefined;
};

function ShopHeader({ shopInfo, defaultImgUrl }: ShopHeaderType) {
  const { shop_email, shop_name } = shopInfo;
  const shopImg = defaultImgUrl ? defaultImgUrl : logo;

  return (
    <>
      <div className="h-20 w-20 overflow-hidden rounded-full border border-Orange">
        <img
          src={shopImg}
          alt="shopImg"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="col-span-2 flex flex-col overflow-hidden text-left">
        <h1 className="w-full text-2xl font-extrabold text-Orange md:text-3xl">
          {shop_name}
        </h1>
        <p className="text-Very-dark-blue">{shop_email}</p>
      </div>
    </>
  );
}

export default ShopHeader;
