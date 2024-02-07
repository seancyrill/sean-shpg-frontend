import React from "react";
import GenericDelete, { modalContentType } from "../GenericDelete";
import useImgControls from "../../hooks/useImgControls";
import { ReactSVG } from "react-svg";
import { ImgType } from "../../types/ImgTypes";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import DragOverlay from "../DragOverlay";

type ProfileImgControlType = {
  imgArr: ImgType[] | null;
  toDefault: number | null;
  setToDefault: React.Dispatch<React.SetStateAction<number | null>>;
  currentDefaultId: number | undefined;
  deleteImg: (img: ImgType) => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setNewImg: React.Dispatch<React.SetStateAction<File | null>>;
  newImgPreview: string | null;
  setNewImgPreview: React.Dispatch<React.SetStateAction<string | null>>;
  handleSubmit: () => Promise<void>;
};

function ProfileImgControl({
  imgArr,
  toDefault,
  setToDefault,
  currentDefaultId,
  deleteImg,
  setIsLoading,
  setNewImg,
  setNewImgPreview,
  newImgPreview,
  handleSubmit,
}: ProfileImgControlType) {
  const { compressImage } = useImgControls();
  const disableAddBtn = imgArr ? imgArr.length >= 4 : false;
  const modalContent: modalContentType = {
    body: "Are you sure you want to delete this image?",
    cancel: "No, Cancel",
    confirm: "Yes, Delete",
    head: "Delete image?",
  };

  ////function controls////
  const handleImageProcessing = async (files: FileList | null) => {
    if (!files) return;
    const toUpload = files[0];

    //resets when emptied
    if (!toUpload) return setNewImgPreview(null);

    //clears urls made
    if (newImgPreview) {
      URL.revokeObjectURL(newImgPreview);
    }

    //compress img then update states
    try {
      setIsLoading(true);
      const compressedImage = await compressImage(toUpload);
      setNewImg(compressedImage);
      const newPreview = URL.createObjectURL(compressedImage);
      setNewImgPreview(newPreview);
    } catch (error) {
      console.log("Failed to compress image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageProcessing(e.target.files);
  };

  function handleCancel() {
    if (toDefault) return setToDefault(null);
    if (newImgPreview) {
      URL.revokeObjectURL(newImgPreview);
      setNewImgPreview(null);
    }
    setNewImg(null);
  }

  ////drag and drop functionality////
  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer) return;
    handleImageProcessing(event.dataTransfer.files);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const { isDragging } = useDragAndDrop(handleDrop, handleDragOver);
  ////
  return (
    <form
      className="flex flex-col rounded-md border-4 border-dashed bg-White p-4 shadow-sm"
      onSubmit={(e) => (e.preventDefault(), handleSubmit())}
    >
      <label
        className={`smooth-animation flex flex-1 cursor-pointer items-center justify-between gap-2 border-b border-Grayish-blue p-2 text-Grayish-blue hover:text-Orange ${
          disableAddBtn && "hidden"
        }`}
      >
        {newImgPreview ? "Choose other image" : "Upload image"}
        <span className="flex gap-2">
          <ReactSVG src="/svg/icon-photo.svg" className="fill-current" />
          <p>{imgArr?.length || 0}/4</p>
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

      {imgArr && imgArr.length > 0 && !newImgPreview && (
        <div className="border-t border-Grayish-blue">
          <h3 className="text-center text-xs text-Dark-grayish-blue">
            Image Bank
          </h3>
          <div className="flex items-end gap-2">
            {imgArr.map((img, i) => {
              const current = currentDefaultId === img.img_id;
              return (
                <div key={i}>
                  {current && (
                    <p className="text-center text-xs text-Green">current</p>
                  )}
                  <div
                    className={`relative flex h-24 w-16 flex-col place-content-center border border-Dark-grayish-blue bg-Light-grayish-blue hover:scale-95 ${
                      current && "border-2 border-Green"
                    } ${toDefault === img.img_id && "border-2 border-Orange"}`}
                  >
                    <img
                      src={img.img_url}
                      onClick={() => setToDefault(img.img_id)}
                      alt="Current Img"
                      className="m-auto h-full w-full flex-1 object-contain"
                    />
                    <GenericDelete
                      handleDelete={() => deleteImg(img)}
                      modalContent={modalContent}
                      disable={current}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-row-reverse justify-between gap-2">
        {(newImgPreview || toDefault) && (
          <>
            <button
              type="submit"
              className="primary-button hover:scale-100 hover:brightness-110"
            >
              Save
            </button>
            <button
              className="secondary-button text-White"
              onClick={(e) => (e.preventDefault(), handleCancel())}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {isDragging && <DragOverlay />}
    </form>
  );
}

export default ProfileImgControl;
