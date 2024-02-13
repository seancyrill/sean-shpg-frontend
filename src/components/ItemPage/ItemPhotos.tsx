import { useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import logo from "/images/icon-logo.png";
import { ImgType } from "../../types/ImgTypes";

type ItemImagesType = {
  item_imgs: ImgType[];
  item_default_img_id: number;
};

export default function ItemImages({
  item_imgs,
  item_default_img_id,
}: ItemImagesType) {
  const defaultImgIndex = item_imgs?.length
    ? item_imgs.findIndex((img) => img.img_id === item_default_img_id)
    : 0;
  const images = item_imgs?.length
    ? item_imgs
    : [{ img_url: logo, thumbnail_url: logo }];
  const [imgIndex, setImgIndex] = useState(defaultImgIndex);
  const fullScreen = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="relative flex max-h-[40%] md:max-h-full">
          <div
            onClick={() => setImgIndex((prev) => (prev > 0 ? prev - 1 : prev))}
            className={`absolute top-1/2 z-10 ml-2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-content-center rounded-full bg-White text-Dark-grayish-blue hover:opacity-50 md:hidden ${
              imgIndex === 0 && "hidden"
            }`}
          >
            <ReactSVG src="/svg/icon-previous.svg" className="stroke-current" />
          </div>
          <img
            src={images[imgIndex].img_url}
            alt="imgIndexed"
            onClick={() => fullScreen.current?.showModal()}
            className="m-auto mb-4 w-full object-cover hover:border-4 hover:border-Orange hover:opacity-90 sm:rounded-xl md:mb-8 md:min-w-[380px] md:max-w-xl"
          />
          <div
            onClick={() =>
              setImgIndex((prev) =>
                prev + 1 !== images.length ? prev + 1 : prev
              )
            }
            className={`absolute  right-0 top-1/2 z-10 mr-2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-content-center rounded-full bg-White text-Dark-grayish-blue hover:opacity-50 md:hidden ${
              imgIndex === item_imgs?.length - 1 && "hidden"
            }`}
          >
            <ReactSVG src="/svg/icon-next.svg" className="stroke-current" />
          </div>
        </div>

        <div className="m-auto hidden w-full min-w-[380px] max-w-xl justify-between md:flex">
          {images.map((img, i) => (
            <img
              onClick={() => setImgIndex(i)}
              src={img.thumbnail_url}
              alt={`itemPhoto${i}`}
              key={i}
              className={`h-20 w-20 rounded-xl object-cover hover:opacity-50 ${
                i === imgIndex ? "border-4 border-Orange" : ""
              } `}
            />
          ))}
        </div>
      </div>

      <dialog
        ref={fullScreen}
        className="min-w-[100vw] bg-transparent focus:border-none focus:outline-none md:min-w-0"
      >
        <div className="grid place-content-center">
          <div
            className="smooth-animation absolute right-0 top-0 mr-2 mt-2 grid h-11 w-11 cursor-pointer place-content-center rounded-full bg-White p-4 text-Soft-Red hover:scale-110"
            onClick={() => fullScreen.current?.close()}
          >
            <ReactSVG src="/svg/icon-close.svg" className="fill-current" />
          </div>
          <img
            src={images[imgIndex].img_url}
            alt="imgFScreen"
            onClick={() => fullScreen.current?.close()}
            className="mb-4 cursor-pointer rounded-xl md:max-h-[600px]"
          />
          <div className="flex w-full items-center justify-center gap-4">
            {images.map((img, i) => (
              <img
                onClick={() => setImgIndex(i)}
                src={img.thumbnail_url}
                alt={`itemPhoto${i}`}
                key={i}
                className={`h-20 w-20 rounded-xl object-cover hover:opacity-50 ${
                  i === imgIndex ? "border-4 border-Orange" : ""
                } `}
              />
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
