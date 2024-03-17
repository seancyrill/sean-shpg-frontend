import { isAxiosError } from "axios";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ImgType } from "../../../types/ImgTypes";
import useImgControls, {
  relevantTableType,
} from "../../../hooks/useImgControls";
import ProfileImgControl from "../../../components/UserInfo/ProfileImgControl";
import logo from "/images/icon-logo.png";
import useRefreshPage from "../../../hooks/useRefreshPage";

export type ProfileDataType = {
  defaultImg: ImgType | null;
  existingImgs: ImgType[] | null;
};

type ProfileType = {
  newId?: number;
};

function Profile({ newId }: ProfileType) {
  const {
    privateReq,
    user_id,
    username,
    shop_id,
    shop_name,
    user_default_img,
  } = useAuthContext();
  const { handleImgDelete, handleImgUpload } = useImgControls();
  const { refreshPage } = useRefreshPage();

  const [userImgs, setUserImgs] = useState<ImgType[] | null>(null);
  const [toDefault, setToDefault] = useState<number | null>(null);
  const profilePreviewImg = () => {
    if (newImgPreview) return newImgPreview;
    if (!user_default_img || !userImgs) return logo;
    if (!toDefault) {
      const currentDefault = userImgs.find(
        ({ img_id }) => img_id === user_default_img.img_id
      )?.img_url;
      return currentDefault;
    }

    const newDefault = userImgs.find(
      ({ img_id }) => img_id === toDefault
    )?.img_url;
    if (newDefault) {
      return newDefault;
    }
  };

  const [newImg, setNewImg] = useState<File | null>(null);
  const [newImgPreview, setNewImgPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  //// fetch data ////
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProfileData() {
      try {
        const imgs = await privateReq.get("/imgs/users", {
          signal: controller.signal,
          params: {
            user_id,
          },
        });
        setUserImgs(imgs.data);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.config?.signal?.aborted) return;
          console.error(error.response?.data);
        } else {
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (user_id) {
      fetchProfileData();
    }

    return () => {
      controller.abort();
    };
  }, [user_id]);

  async function handleSubmit() {
    if (!user_id && !newId) return;
    setIsLoading(true);
    const relevantId = newId || user_id;
    if (!relevantId) return;
    let success = false;
    try {
      if (!toDefault) {
        //uploading new img and set as default
        if (!newImg) return;
        const addedIds = await handleImgUpload({
          newImages: [newImg],
          relevantId,
          relevantTable: "users",
          rounds: 1,
        });
        if (!addedIds?.length) {
          throw new Error("Successfully added, but no ID returned");
        }
        const { img_id } = addedIds[0];
        await privateReq.patch("/imgs/users", { img_id, user_id: relevantId });
        //ends
      } else {
        //set existing imgs to default
        await privateReq.patch("/imgs/users", { img_id: toDefault, user_id });
        setToDefault(null);
        //ends
      }
      success = true;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
      if (success) {
        if (newId) navigate(from, { replace: true });
        refreshPage();
      }
    }
  }

  async function deleteImg(img: ImgType) {
    const relevantId = user_id!;
    const relevantTable: relevantTableType = "users";

    const deleteParams = { relevantId, img, relevantTable };
    setIsLoading(true);
    try {
      await handleImgDelete(deleteParams);
      const removeFromArray =
        userImgs && userImgs.length
          ? userImgs.filter(({ img_id }) => img.img_id !== img_id)
          : [];
      setUserImgs(removeFromArray);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <LoadingSpinner loading={isLoading} />

      <div className="grid flex-1 items-start justify-center bg-Light-grayish-blue">
        <div className="m-4 flex min-w-[180px] flex-col items-center justify-center gap-1 rounded-xl bg-Very-dark-blue p-8 text-center shadow-md">
          <img
            src={profilePreviewImg()}
            alt="pfp"
            className="m-auto h-20 w-20 rounded-full border border-Orange object-cover"
          />
          <p className="text-2xl font-bold capitalize text-Orange">
            {username}
          </p>
          {shop_id !== null && (
            <Link
              to={"/controls/shop"}
              className="text-xl capitalize text-White hover:scale-95"
            >
              {shop_name}
            </Link>
          )}
        </div>
      </div>
      <ProfileImgControl
        imgArr={userImgs}
        toDefault={toDefault}
        currentDefaultId={user_default_img?.img_id}
        setToDefault={setToDefault}
        deleteImg={deleteImg}
        setIsLoading={setIsLoading}
        setNewImg={setNewImg}
        setNewImgPreview={setNewImgPreview}
        newImgPreview={newImgPreview}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Profile;
