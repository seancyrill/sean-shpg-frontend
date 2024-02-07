import { Link } from "react-router-dom";

function BannerSlide3() {
  return (
    <>
      <Link to={"/search/summer"} className="relative h-full w-full">
        <img
          src="/banner/summer-art2.jpg"
          alt="banner1"
          className="h-full w-full object-cover"
        />
        <div className="absolute left-0 top-0 grid h-full w-full items-end justify-center xl:items-start "></div>
      </Link>
      <Link
        to="https://www.vecteezy.com/vector-art/2478324-abstract-summer-sale-background-with-palm-leaves"
        className="absolute bottom-0 right-0 m-2 rounded-full bg-White px-4 py-1 text-xs text-Dark-grayish-blue"
        target="_blank"
      >
        Vecteezy
      </Link>
    </>
  );
}

export default BannerSlide3;
