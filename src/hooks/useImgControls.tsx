import axios, { isAxiosError } from "axios";
import { useAuthContext } from "../context/AuthContext";
import imageCompression from "browser-image-compression";
import { ImgType } from "../types/ImgTypes";

export type relevantTableType = "items" | "users" | "shops";

type HandleImgUploadType = {
  newImages: File[];
  relevantId: number;
  relevantTable: relevantTableType;
  rounds: number;
};

type HandleImgDeleteType = {
  relevantId: number;
  img: ImgType;
  relevantTable: relevantTableType;
};

function useImgControls() {
  const { privateReq, shop_id } = useAuthContext();

  async function handleImgUpload({
    newImages,
    relevantId,
    relevantTable,
    rounds,
  }: HandleImgUploadType) {
    try {
      if (!newImages.length) return;

      //request signed url
      const requestUrls = await privateReq.put(`/imgs`, {
        relevantId,
        relevantTable,
        rounds,
      });
      const signedUrls: string[] = requestUrls.data;
      const newImgUrlArr = await Promise.all(
        newImages.map(async (img, i) => {
          //proceed to use signedurl to directly uplaod img to s3
          await axios.put(signedUrls[i], img);
          //returns an arr of img url
          const newImgUrl = signedUrls[i].split("?")[0];
          return newImgUrl;
        })
      );

      //saves newImgUrl/s to relevant db table
      const addToDb = await privateReq.post(`/imgs/`, {
        relevantId,
        relevantTable,
        newImgUrlArr,
      });
      const addedIds: { img_id: number }[] = addToDb.data;
      return addedIds;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async function handleImgDelete({
    relevantId,
    img,
    relevantTable,
  }: HandleImgDeleteType) {
    try {
      await privateReq.delete(`/imgs/${relevantTable}`, {
        data: { relevantId, img },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;

        console.error(error.response?.data);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async function setItemDefaultImg(img_id: number, item_id: number) {
    try {
      await privateReq.patch("/imgs/items", { img_id, item_id, shop_id });
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    }
  }

  async function compressImage(img: File) {
    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      return await imageCompression(img, options);
    } catch (error) {
      throw error;
    }
  }

  return { setItemDefaultImg, compressImage, handleImgUpload, handleImgDelete };
}

export default useImgControls;
