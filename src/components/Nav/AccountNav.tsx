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
    <div className="flex h-full max-w-[50%] items-center">
      {/* Merch button */}
      <Link
        to={handleLinkTo()}
        replace
        state={"/controls/newshop"}
        className="smooth-animation flex max-w-[200px] items-center gap-2 overflow-hidden px-2 py-4 text-lg hover:scale-105 hover:text-Orange md:px-4 md:py-8"
      >
        {!shop_id ? (
          <ReactSVG src="/svg/icon-merchant.svg" className="fill-current" />
        ) : (
          <img src={shopImg} className="h-8 w-8 rounded-full object-cover" />
        )}
        <p className="hidden whitespace-nowrap lg:block">{handleLinkText()}</p>
      </Link>

      {/* User buttons */}
      {token && (
        <Link
          to={"/controls/user"}
          className="smooth-animation flex max-w-[200px] items-center gap-2 overflow-hidden px-2 py-4 text-lg hover:scale-105 hover:text-Orange md:px-4 md:py-8"
        >
          <img src={userImg} className="h-8 w-8 object-cover" />
          <p className="hidden whitespace-nowrap text-lg lg:block">
            {username}
          </p>
        </Link>
      )}

      <div className="mx-2 h-10 border-r border-Dark-grayish-blue sm:mx-4" />

      <AccountControls />
    </div>
  );
}

export default AccountNav;
