import { useAuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import AccountControls from "./AccountControls";
import { ReactSVG } from "react-svg";
import logo from "/images/icon-logo.png";

function AccountNav() {
  const {
    username,
    token,
    shop_id,
    shop_name,
    user_default_img,
    shop_default_img,
  } = useAuthContext();
  const userImg = user_default_img ? user_default_img.thumbnail_url : logo;
  const shopImg = shop_default_img ? shop_default_img.thumbnail_url : logo;

  const handleLinkTo = () => {
    if (shop_id) {
      return "/controls/shop";
    } else {
      return token ? "/controls/newshop" : "/registrar/register";
    }
  };

  const handleLinkText = () => {
    if (shop_id) {
      return shop_name;
    } else {
      return "START SELLING";
    }
  };

  return (
    <div className="flex h-full items-center">
      {/* Merch button */}
      <Link
        to={handleLinkTo()}
        replace
        state={"/controls/newshop"}
        className="smooth-animation flex items-center gap-2 px-2 py-4 text-lg hover:scale-105 hover:text-Orange md:px-4 md:py-8"
      >
        {!shop_id ? (
          <ReactSVG src="/svg/icon-merchant.svg" className="fill-current" />
        ) : (
          <img src={shopImg} className="h-8 w-8 rounded-full" />
        )}
        <p className="hidden md:block">{handleLinkText()}</p>
      </Link>

      <div className="h-10 border-r border-Dark-grayish-blue" />

      {/* User buttons */}
      {token && (
        <Link
          to={"/controls/user"}
          className="smooth-animation flex items-center gap-2 px-2 py-4 text-lg hover:scale-105 hover:text-Orange md:px-4 md:py-8"
        >
          <img src={userImg} className="h-8 w-8 rounded-full" />
          <p className="hidden text-lg md:block">{username}</p>
        </Link>
      )}
      <AccountControls />
    </div>
  );
}

export default AccountNav;
