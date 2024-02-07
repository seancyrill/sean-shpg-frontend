import React, { useState } from "react";
import { ShopInfoType } from "../../pages/ShopPage";
import logo from "/images/icon-logo.png";
import ShopHeader from "./ShopHeader";
import { ReactSVG } from "react-svg";
import useImgControls from "../../hooks/useImgControls";
import { useAuthContext } from "../../context/AuthContext";
import useRefreshPage from "../../hooks/useRefreshPage";
import { isAxiosError } from "axios";

type PostSetupShopType = {
  newShopInput: {
    shop_name: string;
    shop_email: string;
  };
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setNewShopInput: React.Dispatch<
    React.SetStateAction<{
      shop_name: string;
      shop_email: string;
    }>
  >;
  newShopId: number | null;
};

function PostSetupShop({
  newShopInput,
  setLoading,
  setNewShopInput,
  newShopId: shop_id,
}: PostSetupShopType) {
  const { privateReq, setFetchErrModal } = useAuthContext();
  const { compressImage, handleImgUpload } = useImgControls();
  const { refreshPage } = useRefreshPage();

  const [newImg, setNewImg] = useState<File | null>(null);
  const [newImgPreview, setNewImgPreview] = useState<string | null>(null);

  const disableAddBtn = newImg !== null;

  const preview = {
    shop_name: newShopInput.shop_name,
    shop_email: newShopInput.shop_email,
    default_img_url: newImgPreview || logo,
  } as ShopInfoType;

  async function handleAttachImg(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const toUpload = e.target.files[0];

    //resets when emptied
    if (!toUpload) return setNewImgPreview(null);

    //clears urls made
    if (newImgPreview) {
      URL.revokeObjectURL(newImgPreview);
    }

    //compress img then update states
    try {
      setLoading(true);
      const compressedImage = await compressImage(toUpload);
      setNewImg(compressedImage);
      const newPreview = URL.createObjectURL(compressedImage);
      setNewImgPreview(newPreview);
    } catch (error) {
      console.log("Failed to compress image");
    } finally {
      setLoading(false);
    }
  }

  function handleEnd() {
    setNewShopInput({ shop_name: "", shop_email: "" });
    refreshPage();
  }

  async function handleAddImg() {
    if (!newImg || !shop_id) return;

    setLoading(true);
    try {
      const addedIds = await handleImgUpload({
        newImages: [newImg],
        relevantId: shop_id,
        relevantTable: "shops",
        rounds: 1,
      });
      if (!addedIds?.length) {
        throw new Error("Successfully added, but no ID returned");
      }
      const { img_id } = addedIds[0];
      await privateReq.patch("/imgs/shops", { img_id, shop_id });
      handleEnd();
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.message);
        setFetchErrModal(true);
      } else {
        console.error(error);
      }
    }
  }

  function handleCancel() {
    if (newImgPreview) {
      URL.revokeObjectURL(newImgPreview);
      setNewImgPreview(null);
    }
    setNewImg(null);
  }

  return (
    <div className="flex h-fit flex-col items-center gap-4">
      <form
        className="mt-8 flex h-fit min-w-[320px] max-w-xl flex-1 flex-col items-center gap-4 border bg-White p-4 shadow-md"
        onSubmit={(e) => (e.preventDefault(), handleAddImg())}
      >
        <h1 className="text-sm font-bold">Add shop image:</h1>
        <div className="-mx-4 grid place-content-center bg-Light-grayish-blue md:mx-0">
          <div className="m-4 flex h-fit w-fit max-w-[310px] items-center gap-4 rounded-xl border border-Very-dark-blue bg-White p-6 shadow-lg">
            <ShopHeader
              shopInfo={preview}
              defaultImgUrl={newImgPreview || logo}
            />
          </div>
        </div>

        {!newImg ? (
          <label
            className={`smooth-animation flex w-full flex-1 cursor-pointer items-center justify-between gap-2 border-b border-Grayish-blue p-2 text-Grayish-blue hover:text-Orange ${
              disableAddBtn && "hidden"
            }`}
          >
            {newImgPreview ? "Choose other image" : "Upload image"}
            <span className="flex gap-2">
              <ReactSVG src="/svg/icon-photo.svg" className="fill-current" />
            </span>
            <input
              className="hidden border-none bg-transparent outline-none"
              disabled={disableAddBtn}
              name="media"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAttachImg}
            />
          </label>
        ) : (
          <button
            className="smooth-animation flex w-full flex-1 cursor-pointer items-center justify-between gap-2 border-b border-Grayish-blue p-2 text-Grayish-blue hover:text-Orange"
            onClick={(e) => (e.preventDefault(), handleCancel())}
          >
            Choose different image
          </button>
        )}

        <button type="submit" className="primary-button w-full max-w-[272px]">
          Save
        </button>
      </form>
      <div className="flex w-[320px] flex-col gap-1 rounded-sm bg-White p-6 shadow-md">
        <button
          className="secondary-button text-center text-White hover:bg-Soft-Red"
          onClick={(e) => (e.preventDefault(), handleEnd())}
        >
          Skip this
        </button>

        <p className="text-center text-xs text-Grayish-blue">
          You can always come back to customize your shop settings.
        </p>
      </div>
    </div>
  );
}

export default PostSetupShop;
