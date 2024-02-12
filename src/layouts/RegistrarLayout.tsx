import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function RegistrarLayout() {
  const { refreshAccessToken, authLoading } = useAuthContext();

  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <main className="flex flex-1 flex-col bg-Light-grayish-blue">
      <header className="smooth-animation sticky top-0 grid place-content-center bg-White p-4 text-5xl shadow-md hover:text-Orange md:p-8">
        <Logo />
      </header>
      <section className="flex flex-1 justify-center">
        <Outlet />
      </section>

      <LoadingSpinner loading={authLoading} />
    </main>
  );
}

export default RegistrarLayout;
