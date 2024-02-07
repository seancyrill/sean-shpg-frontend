import { useEffect, useRef, useState } from "react";
import BannerSlide1 from "./Banners/BannerSlide1";
import BannerSlide2 from "./Banners/BannerSlide2";
import BannerSlide3 from "./Banners/BannerSlide3";
import { ReactSVG } from "react-svg";

function Banner() {
  const [page, setPage] = useState(0);
  const banners = [<BannerSlide1 />, <BannerSlide2 />, <BannerSlide3 />];
  const prevPage = (page - 1 + banners.length) % banners.length;

  const intervalId = useRef<number | null>(null);
  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalId.current as number);
  }, [banners.length]);

  function startInterval() {
    intervalId.current = window.setInterval(() => {
      setPage((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
  }

  function goToNextSlide() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    setPage((prevIndex) => (prevIndex + 1) % banners.length);
    startInterval();
  }

  function goToPrevSlide() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    setPage((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
    startInterval();
  }

  function goToSpecificSlide(i: number) {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    setPage(i);
    startInterval();
  }

  return (
    <div className="relative m-auto h-[400px] w-full overflow-hidden shadow-xl">
      <div className="smooth-animation flex w-full">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute left-0 top-0 h-full w-full transform transition-transform ${
              index === prevPage
                ? "-translate-x-full"
                : index === page
                ? "z-10 translate-x-0"
                : "translate-x-full"
            }`}
          >
            {banner}
          </div>
        ))}
        <button
          onClick={(e) => (e.preventDefault(), goToPrevSlide())}
          className={`absolute top-1/2 z-10 ml-2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-content-center rounded-full bg-White text-Dark-grayish-blue hover:opacity-50`}
        >
          <ReactSVG src="/svg/icon-previous.svg" className="stroke-current" />
        </button>

        <button
          onClick={(e) => (e.preventDefault(), goToNextSlide())}
          className={`absolute right-0 top-1/2 z-10 mr-2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-content-center rounded-full bg-White text-Dark-grayish-blue hover:opacity-50`}
        >
          <ReactSVG src="/svg/icon-next.svg" className="stroke-current" />
        </button>

        <div className="absolute bottom-0 left-1/2 z-10 m-2 flex -translate-x-1/2 gap-1 rounded-full bg-Dark-grayish-blue bg-opacity-20 p-2">
          {banners.map(({}, i) => (
            <button
              onClick={(e) => (e.preventDefault(), goToSpecificSlide(i))}
              className={`smooth-animation h-3 w-3 rounded-full ${
                page === i ? "border bg-Orange" : "bg-White"
              }`}
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
