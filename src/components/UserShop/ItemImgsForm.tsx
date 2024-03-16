import React from "react";
import { ReactSVG } from "react-svg";
import GenericDelete, { modalContentType } from "../GenericDelete";
import { ImgDefaultType, ImgType } from "../../types/ImgTypes";
import { isAxiosError } from "axios";
import useImgControls, { relevantTableType } from "../../hooks/useImgControls";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import DragOverlay from "../DragOverlay";

type ItemImgsFormType = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  newImages: File[] | null;
  setNewImages: React.Dispatch<React.SetStateAction<File[] | null>>;
  newImgPreview: string[] | null;
  setNewImgPreview: React.Dispatch<React.SetStateAction<string[] | null>>;
  defaultImg: ImgDefaultType;
  setDefaultImg: React.Dispatch<React.SetStateAction<ImgDefaultType>>;
  currentImages: ImgType[] | null;
  setCurrentImages?: React.Dispatch<React.SetStateAction<ImgType[] | null>>;
  item_id?: number;
};

function ItemImgsForm({
  setLoading,
  newImages,
  setNewImages,
  newImgPreview,
  setNewImgPreview,
  defaultImg,
  setDefaultImg,
  currentImages,
  setCurrentImages,
  item_id,
}: ItemImgsFormType) {
  const { compressImage, handleImgDelete } = useImgControls();
  const totalImgsCount =
    (newImages?.length || 0) + (currentImages?.length || 0);
  const disableAddBtn = newImages ? totalImgsCount >= 4 : false;

  const handleImageProcessing = async (files: FileList | null) => {
    if (!files) return;

    const uploadRemaining = 4 - totalImgsCount;
    const imgArr = Array.from(files).slice(0, uploadRemaining);

    setLoading(true);
    const compressedImgArr = await Promise.all(
      imgArr.map(async (img) => {
        try {
          const compressedImage = await compressImage(img);
          return compressedImage;
        } catch (error) {
          console.error("Error compressing image:", error);
          return img;
        }
      })
    );

    setNewImages((prevImages) => {
      const updatedImages = prevImages
        ? [...prevImages, ...compressedImgArr]
        : compressedImgArr;
      return updatedImages;
    });

    const imgUrlArr = compressedImgArr.map((img) => URL.createObjectURL(img));
    setNewImgPreview((prevImgPreview) => {
      const updatedPreview = prevImgPreview
        ? [...prevImgPreview, ...imgUrlArr]
        : imgUrlArr;
      return updatedPreview;
    });

    setLoading(false);
  };

  const handleAttachImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageProcessing(e.target.files);
  };

  function removeAttachedImg(i: number) {
    if (!newImages || !newImgPreview) return;
    //resets index when user removes a selected new img
    if (defaultImg.imgStatus === "new" && defaultImg.index === i) {
      setDefaultImg({ imgStatus: "new", index: 0 });
    }
    const filteredNI = newImages.filter(({}, index) => i !== index);
    const filteredNP = newImgPreview.filter(({}, index) => i !== index);
    URL.revokeObjectURL(newImgPreview[i]);
    setNewImages(filteredNI);
    setNewImgPreview(filteredNP);
  }

  async function removeExistingImg(
    relevantId: number | undefined,
    img: ImgType,
    relevantTable: relevantTableType
  ) {
    if (relevantId === undefined || !setCurrentImages) return;

    const deleteParams = { relevantId, img, relevantTable };
    setLoading(true);
    try {
      await handleImgDelete(deleteParams);
      const removeFromArray =
        currentImages?.filter(({ img_id }) => img.img_id !== img_id) || [];
      setCurrentImages(removeFromArray);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  function setNewToDef(i: number) {
    setDefaultImg({ imgStatus: "new", index: i });
  }

  function setExsToDef(img_id: number) {
    setDefaultImg({ imgStatus: "existing", img_id });
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

  const modalContent: modalContentType = {
    body: "Are you sure you want to remove this image?",
    cancel: "No, Cancel",
    confirm: "Yes, Delete",
    head: "Delete image?",
  };

  return (
    <div className="flex flex-col border border-dashed border-Very-dark-blue p-4">
      <label
        className={`smooth-animation flex cursor-pointer items-center justify-between gap-2 border-b border-Grayish-blue p-2 text-Grayish-blue hover:text-Orange ${
          disableAddBtn && "hidden"
        }`}
      >
        Up to 4 Images
        <ReactSVG src="/svg/icon-photo.svg" className="fill-current" />
        <input
          disabled={disableAddBtn}
          className="hidden flex-1 border-none bg-transparent outline-none"
          name="media"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleAttachImg}
        />
      </label>

      {newImgPreview && newImgPreview.length > 0 && (
        <div className="pb-2">
          <h3 className="text-center text-xs text-Dark-grayish-blue">
            Images to Add
          </h3>
          <div className="flex gap-1">
            {newImgPreview.map((img_url, i) => {
              return (
                <div
                  className={`relative flex h-24 w-16 flex-col place-content-center border border-Dark-grayish-blue bg-Light-grayish-blue hover:scale-95 ${
                    defaultImg.imgStatus === "new" &&
                    defaultImg.index === i &&
                    "border-2 border-Orange"
                  }`}
                  key={i}
                >
                  <img
                    src={img_url}
                    alt={`New Image ${i + 1}`}
                    onClick={() => setNewToDef(i)}
                    className="m-auto h-full w-full flex-1 object-contain"
                  />
                  <GenericDelete
                    handleDelete={() => removeAttachedImg(i)}
                    modalContent={modalContent}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentImages && currentImages.length > 0 && (
        <div className="border-t border-Grayish-blue">
          <h3 className="text-center text-xs text-Dark-grayish-blue">
            Current Images
          </h3>
          <div className="flex gap-1">
            {currentImages.map((img, i) => {
              return (
                <div
                  className={`relative flex h-24 w-16 flex-col place-content-center border border-Dark-grayish-blue bg-Light-grayish-blue hover:scale-95 ${
                    defaultImg.imgStatus === "existing" &&
                    defaultImg.img_id === img.img_id &&
                    "border-2 border-Orange"
                  }`}
                  key={i}
                >
                  <img
                    src={img.thumbnail_url}
                    onClick={() => setExsToDef(img.img_id)}
                    alt="Current Img"
                    className="m-auto h-full w-full flex-1 object-contain"
                  />
                  <GenericDelete
                    handleDelete={() =>
                      removeExistingImg(item_id, img, "items")
                    }
                    modalContent={modalContent}
                    disable={
                      defaultImg.imgStatus === "existing" &&
                      defaultImg.img_id === img.img_id
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isDragging && <DragOverlay />}
    </div>
  );
}

export default ItemImgsForm;
