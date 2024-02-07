import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { ReactSVG } from "react-svg";

export default function AccountControls() {
  const { token, handleLogOut, shop_id } = useAuthContext();
  const [showAccountControls, setShowAccountControls] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function handleToggle() {
    setShowAccountControls((prev) => !prev);
  }

  function handleCLick() {
    if (!token) {
      navigate("/registrar/login", { replace: true, state: location.pathname });
    } else {
    }
  }

  return (
    <div
      onMouseEnter={() => setShowAccountControls(true)}
      onMouseLeave={() => {
        setShowAccountControls(false);
      }}
      onClick={handleToggle}
      className="grid cursor-pointer place-content-center px-2"
    >
      <div className="relative grid place-content-center">
        <ReactSVG
          src={token ? "/svg/icon-settings.svg" : "/svg/icon-profile.svg"}
          className={`smooth-animation ${
            showAccountControls ? "scale-110 fill-Orange" : "fill-White"
          }`}
          onClick={handleCLick}
        />

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
    </div>
  );
}
