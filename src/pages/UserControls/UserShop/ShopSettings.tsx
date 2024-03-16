import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import ProfileImgControl from "../../../components/UserInfo/ProfileImgControl";
import { useShopContext } from "../UserShop";
import ShopHeader from "../../../components/UserShop/ShopHeader";
import ShopSettingInputField from "../../../components/UserShop/ShopSettingInputField";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import useImgControls, {
  relevantTableType,
} from "../../../hooks/useImgControls";
import useRefreshPage from "../../../hooks/useRefreshPage";
import { ImgType } from "../../../types/ImgTypes";
import { isAxiosError } from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { EMAIL_REGEX, NAME_REGEX } from "../NewShop";
import { ShopInfoType } from "../../ShopPage";

function ShopSettings() {
  const { shopInfo } = useShopContext();
  const { handleImgDelete, handleImgUpload } = useImgControls();
  const { refreshPage } = useRefreshPage();
  const { privateReq, shop_default_img } = useAuthContext();
  const { shop_email, shop_id, shop_name } = shopInfo;

  const [newName, setNewName] = useState(shop_name);
  const [newEmail, setNewEmail] = useState(shop_email);

  const [shopImgs, setShopImgs] = useState<ImgType[] | null>(null);
  const [toDefault, setToDefault] = useState<number | null>(null);
  const profilePreviewImg = () => {
    //newImg as priority
    if (newImgPreview) return newImgPreview;
    //then the new default the user is setting
    const newDefault = shopImgs?.find(
      ({ img_id }) => img_id === toDefault
    )?.img_url;
    if (newDefault) {
      return newDefault;
    }
    //else just return the default, returns undefined if there isnt
    return shop_default_img?.img_url;
  };

  const [newImg, setNewImg] = useState<File | null>(null);
  const [newImgPreview, setNewImgPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  //// fetch data shop imgs ////
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProfileData() {
      try {
        const imgs = await privateReq.get("/imgs/shops", {
          signal: controller.signal,
          params: {
            shop_id,
          },
        });
        setShopImgs(imgs.data);
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

    if (shop_id) {
      fetchProfileData();
    }

    return () => {
      controller.abort();
    };
  }, [shop_id]);

  async function handleSubmit() {
    if (!shop_id) return;
    setIsLoading(true);
    let success = false;

    try {
      if (!toDefault) {
        //uploading new img and set as default
        if (!newImg) return;
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
        //ends
      } else {
        //set existing imgs to default
        await privateReq.patch("/imgs/shops", { img_id: toDefault, shop_id });
        setToDefault(null);
        //ends
      }

      success = true;
    } catch (error) {
      setIsLoading(false);
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
      if (success) {
        refreshPage();
      }
    }
  }

  async function deleteImg(img: ImgType) {
    const relevantId = shop_id!;
    const relevantTable: relevantTableType = "shops";

    const deleteParams = { relevantId, img, relevantTable };
    setIsLoading(true);
    try {
      await handleImgDelete(deleteParams);
      const removeFromArray =
        shopImgs?.filter(({ img_id }) => img.img_id !== img_id) || [];
      setShopImgs(removeFromArray);
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

  async function handleEdiName() {
    let success = false;
    try {
      setIsLoading(true);
      await privateReq.patch("/shops/name", { shop_name: newName, shop_id });
      success = true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
      success && refreshPage();
    }
  }

  async function handleEdiEmail() {
    try {
      setIsLoading(true);
      await privateReq.patch("/shops/email", { shop_email: newEmail, shop_id });
      setIsLoading(false);
      refreshPage();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  const preview = {
    shop_name: newName,
    shop_email: newEmail,
    default_img_url: newImgPreview || shopInfo.default_img_url,
  } as ShopInfoType;

  const navigate = useNavigate();
  function backToShop() {
    navigate("/controls/shop");
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b bg-White p-8">
          <h1 className="text-2xl font-bold">Shop settings</h1>

          <ReactSVG
            src="/svg/icon-close.svg"
            className="cursor-pointer fill-Red p-2 hover:scale-110"
            onClick={backToShop}
          />
        </div>

        <div className="flex flex-1 flex-col-reverse md:flex-row">
          <div className="flex min-w-[320px] flex-col gap-4 border-r p-6">
            <ShopSettingInputField
              state={newName}
              setState={setNewName}
              defaultVal={shop_name}
              header="Name"
              handleSave={handleEdiName}
              regexPattern={NAME_REGEX}
            />
            <ShopSettingInputField
              state={newEmail}
              setState={setNewEmail}
              defaultVal={shop_email}
              header="Email"
              handleSave={handleEdiEmail}
              regexPattern={EMAIL_REGEX}
            />
            <ProfileImgControl
              imgArr={shopImgs}
              toDefault={toDefault}
              currentDefaultId={shop_default_img?.img_id}
              setToDefault={setToDefault}
              deleteImg={deleteImg}
              setIsLoading={setIsLoading}
              setNewImg={setNewImg}
              setNewImgPreview={setNewImgPreview}
              newImgPreview={newImgPreview}
              handleSubmit={handleSubmit}
            />
          </div>
          <div className="relative w-full bg-Light-grayish-blue p-4 pt-8">
            <p className="absolute left-0 top-1/2 m-4 -translate-x-1/2 -rotate-90 text-Dark-grayish-blue">
              Preview
            </p>
            <div className="m-auto grid max-w-[310px] grid-cols-3 items-center gap-4 rounded-xl border border-Very-dark-blue bg-White p-6 shadow-lg">
              <ShopHeader
                shopInfo={preview}
                defaultImgUrl={profilePreviewImg()}
              />
            </div>
          </div>
        </div>
      </div>

      <LoadingSpinner loading={isLoading} />
    </>
  );
}

export default ShopSettings;
