import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function UserInfo() {
  const [openNav, setOpenNav] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const titleHead = () => {
    const pathname = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1
    );
    let result;
    switch (pathname) {
      case "user":
        result = "User Profile";
        break;
      case "address":
        result = "My Address";
        break;
      case "change":
        result = "Change Password";
        break;

      default:
        result = "My Orders";
        break;
    }
    return result;
  };

  const navTitle = () => {
    const pathname = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1
    );
    let result;
    switch (pathname) {
      case "user":
        result = "Profile";
        break;
      case "address":
        result = "Address";
        break;
      case "change":
        result = "Change Password";
        break;

      default:
        result = "Orders";
        break;
    }
    return result;
  };

  function closeOnNavigate() {
    if (openNav) {
      setOpenNav(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpenNav((prev) => !prev)}
        className="md:cursor-default"
      >
        <h1 className="border-b pb-2 pt-4 text-2xl font-extrabold uppercase md:p-8">
          {titleHead()}
        </h1>
        <div
          className={`smooth-animation flex origin-bottom items-center justify-between bg-Very-dark-blue py-4 pl-6 text-White md:hidden ${
            openNav ? "scale-y-0" : "scale-y-100"
          }`}
        >
          <p>{navTitle()}</p>
          <p className="rotate-90">...</p>
        </div>
      </button>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside
          onClick={closeOnNavigate}
          className={`smooth-animation absolute flex w-full min-w-[200px] origin-top flex-col border-r bg-White pb-4 md:relative md:w-fit md:scale-100 ${
            openNav ? "scale-y-100" : "scale-y-0"
          }`}
        >
          <Link
            className={`py-4 pl-6 pr-10
              ${path.endsWith("user") && "bg-Very-dark-blue text-White"}
            `}
            to={"/controls/user"}
          >
            Profile
          </Link>
          <Link
            className={`py-4 pl-6 pr-10
              ${path.endsWith("address") && "bg-Very-dark-blue text-White"}
            `}
            to={"/controls/user/address"}
          >
            Addresses
          </Link>
          <Link
            className={`py-4 pl-6 pr-10
              ${titleHead() === "My Orders" && "bg-Very-dark-blue text-White"}
            `}
            to={"/controls/user/orders"}
          >
            Orders
          </Link>
          <Link
            className={`py-4 pl-6 pr-10
              ${path.endsWith("change") && "bg-Very-dark-blue text-White"}
            `}
            to={"/controls/user/change"}
          >
            Change Password
          </Link>
        </aside>

        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default UserInfo;
