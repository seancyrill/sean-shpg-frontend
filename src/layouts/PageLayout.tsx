import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import CartError from "../components/fetchError";
import LoadingSpinner from "../components/LoadingSpinner";
import SecondNav from "../components/SecondNav";

export default function PageLayout() {
  const { refreshAccessToken, fetchErrModal, setFetchErrModal, authLoading } =
    useAuthContext();

  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <>
      <LoadingSpinner loading={authLoading} />
      <header>
        <Nav />
        <SecondNav />
      </header>
      <main
        className="mx-auto flex min-h-[80vh] w-full max-w-screen-2xl flex-1 flex-col bg-Light-grayish-blue"
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        <CartError
          fetchErrModal={fetchErrModal}
          setFetchErrModal={setFetchErrModal}
        />
        <Outlet />
      </main>
      <footer className="mt-16">
        <Footer />
      </footer>
    </>
  );
}
