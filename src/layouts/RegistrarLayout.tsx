import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";

function RegistrarLayout() {
  return (
    <main className="flex flex-1 flex-col bg-Light-grayish-blue">
      <header className="smooth-animation sticky top-0 grid place-content-center bg-White p-4 text-5xl shadow-md hover:text-Orange md:p-8">
        <Logo />
      </header>
      <section className="flex flex-1 justify-center">
        <Outlet />
      </section>
    </main>
  );
}

export default RegistrarLayout;
