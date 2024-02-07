import { Link } from "react-router-dom";
import Logo from "../components/Logo";

function Error404() {
  return (
    <main className="grid flex-1 place-content-center bg-Light-grayish-blue">
      <div className="flex flex-col rounded-r-md bg-White p-4 shadow-md">
        <h1 className="smooth-animation text-[2.75rem] hover:text-Orange">
          <Logo />
        </h1>
        <p className="mb-2 text-center">You seem to be lost</p>
        <Link
          to={"/"}
          className="secondary-button hover:primary-button text-center text-White"
        >
          Home
        </Link>
      </div>
    </main>
  );
}

export default Error404;
