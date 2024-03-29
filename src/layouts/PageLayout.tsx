import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import CartError from "../components/fetchError";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PageLayout() {
  const { refreshAccessToken, fetchErrModal, setFetchErrModal, authLoading } =
    useAuthContext();

  //fetch credentials
  useEffect(() => {
    refreshAccessToken();
  }, []);

  //scrolls to top everytime the route changes
  const location = useLocation();
  const { pathname, state } = location;
  useEffect(() => {
    //doesnt scroll to top if user clicks back
    if (state === pathname) return;

    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <LoadingSpinner loading={authLoading} />
      <main
        className="mx-auto flex min-h-[80vh] w-full max-w-screen-2xl flex-1 flex-col bg-Light-grayish-blue"
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        <CartError
          fetchErrModal={fetchErrModal}
          setFetchErrModal={setFetchErrModal}
        />
        <Nav />
        <Outlet />
      </main>
      <footer className="mt-16">
        <Footer />
      </footer>
    </>
  );
}
