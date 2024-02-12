import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

function UserControls() {
  const { token, shop_id, authLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const onUserSettings = location.pathname.startsWith("/controls/user");

  useEffect(() => {
    if (!token) {
      navigate("/registrar/login", { state: location.pathname });
    }
  }, [token]);

  return (
    <>
      <aside className="mx-2 flex justify-between text-center">
        <Link
          className={`w-1/2 border-[1px] border-b-0 p-2 hover:opacity-60 ${
            onUserSettings
              ? "z-10 translate-y-1 border-b-0 bg-White font-semibold"
              : "translate-x-1 translate-y-3"
          }`}
          to={"/controls/user"}
        >
          User
        </Link>

        <Link
          className={`w-1/2 border-[1px] border-b-0 p-2 hover:opacity-60 ${
            !onUserSettings
              ? "z-10 translate-y-1 border-b-0 bg-White font-semibold"
              : "-translate-x-1 translate-y-3"
          }`}
          to={`/controls/${shop_id ? "shop" : "newshop"}`}
        >
          {shop_id ? "Shop" : "Create Shop"}
        </Link>
        <div></div>
      </aside>

      <section className="relative mx-2 mb-2 flex flex-1 flex-col border-[1px] bg-White">
        {authLoading ? <LoadingSpinner loading={authLoading} /> : <Outlet />}
      </section>
    </>
  );
}

export default UserControls;
