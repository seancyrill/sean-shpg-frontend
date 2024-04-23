import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { ReactSVG } from "react-svg";

export default function AccountControls() {
  const { token, handleLogOut, shop_id } = useAuthContext();
  const [showAccountControls, setShowAccountControls] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function handleOpen() {
    setShowAccountControls(true);
  }

  function handleClose() {
    setShowAccountControls(false);
  }

  function handleClick() {
    if (!token) {
      navigate("/registrar/login", { replace: true, state: location.pathname });
    } else {
      setShowAccountControls(true);
    }
  }

  return (
    <div
      className="relative z-40 ml-2 grid cursor-pointer place-content-center pr-2"
      onPointerEnter={handleOpen}
      onPointerLeave={handleClose}
    >
      <button
        onClick={(e) => (e.preventDefault(), handleClick())}
        onBlur={handleClose}
      >
        <ReactSVG
          src={token ? "/svg/icon-settings.svg" : "/svg/icon-profile.svg"}
          className={`smooth-animation ${
            showAccountControls ? "scale-110 fill-Orange" : "fill-White"
          }`}
        />
      </button>

      <div
        className={`smooth-animation absolute bottom-0 right-0 min-w-[200px] origin-top-right translate-y-full border-2 bg-white ${
          !showAccountControls && "scale-0"
        }`}
      >
        {token ? (
          <>
            <Link
              to={"/controls/user"}
              className="block w-full whitespace-nowrap px-5 py-2 text-left text-black hover:bg-Light-grayish-blue hover:text-Orange hover:opacity-95"
            >
              Account Settings
            </Link>

            <Link
              to={"/controls/shop"}
              className="block w-full whitespace-nowrap px-5 py-2 text-left text-black hover:bg-Light-grayish-blue hover:text-Orange hover:opacity-95"
            >
              {shop_id ? "Merchandise Settings" : "Create Shop"}
            </Link>

            <button
              onClick={(e) => (e.preventDefault(), handleLogOut())}
              className="block w-full whitespace-nowrap px-5 py-2 text-left text-black hover:bg-Light-grayish-blue hover:text-Red"
            >
              Log-out
            </button>
          </>
        ) : (
          <>
            <Link
              to={"/registrar/login"}
              state={location.pathname}
              replace
              className="block w-full whitespace-nowrap px-5 py-2 text-left text-black hover:bg-Light-grayish-blue hover:text-Orange hover:opacity-95"
            >
              Login
            </Link>

            <Link
              to={"/registrar/register"}
              state={location.pathname}
              replace
              className="block w-full whitespace-nowrap px-5 py-2 text-left text-black hover:bg-Light-grayish-blue hover:text-Orange hover:opacity-95"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
