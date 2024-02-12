import { isAxiosError } from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useShopContext } from "../UserShop";
import ShopItemForm from "../../../components/UserShop/ShopItemForm";
import { ItemInfoType } from "../../../types/ShoppingCartContextTypes";
import { ReactSVG } from "react-svg";
import SuccessModal from "../../../components/UserShop/SuccessModal";
import { ImgDefaultType, ImgType } from "../../../types/ImgTypes";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useImgControls from "../../../hooks/useImgControls";

function EditItem() {
  const { id } = useParams();
  const { privateReq, basicReq } = useAuthContext();
  const { shopItems } = useShopContext();
  const { setItemDefaultImg, handleImgUpload } = useImgControls();

  const [loading, setLoading] = useState(true);

  const modalRef = useRef<HTMLDialogElement>(null);
  const confirmationModal = modalRef.current!;

  useEffect(() => {
    if (confirmationModal) {
      loading ? confirmationModal.showModal() : confirmationModal.close();
    }
  }, [loading, confirmationModal]);

  const [editInput, setEditInput] = useState<ItemInfoType | null>(null);
  const [newImages, setNewImages] = useState<File[] | null>(null);
  const [currentImages, setCurrentImages] = useState<ImgType[] | null>(null);
  const [defaultImg, setDefaultImg] = useState<ImgDefaultType>({
    imgStatus: "new",
    index: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  //set product imgs
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchImgs = async () => {
      setLoading(true);
      try {
        const response = await basicReq.get(`/items/${id}`, {
          signal,
        });
        setEditInput(response.data);

        if (response.data?.item_default_img_id) {
          setDefaultImg({
            imgStatus: "existing",
            img_id: response.data?.item_default_img_id,
          });
        }
        setCurrentImages(response.data?.item_imgs);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.config?.signal?.aborted) return;
          console.error(error.response?.data);
          setError(error.response?.data?.message);
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImgs();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleEdit() {
    setLoading(true);
    if (!editInput) return;
    try {
      await privateReq.patch("/items", editInput);
      //add new imgs (AND setting as default /option 1)
      if (newImages) {
        const addedIds = await handleImgUpload({
          newImages,
          relevantId: editInput.item_id,
          relevantTable: "items",
          rounds: newImages.length,
        });
        if (defaultImg.imgStatus === "new") {
          if (addedIds === undefined) return;
          const { img_id } = addedIds[defaultImg.index];
          await setItemDefaultImg(img_id, editInput.item_id);
        }
      }
      //changes current img as default /option 2
      if (
        defaultImg.imgStatus === "existing" &&
        defaultImg.img_id !== editInput.img_id
      ) {
        await setItemDefaultImg(defaultImg.img_id, editInput.item_id);
      }
      //show success screen
      setShowModal(true);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
        setError(error.response?.data?.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  const navigate = useNavigate();
  function backToShop() {
    setShowModal(false);
    navigate("/controls/shop");
  }

  useEffect(() => {
    if (!shopItems.length) backToShop();
  }, []);

  return (
    <>
      {editInput && (
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b p-8">
            <h1 className="text-2xl font-bold">Edit Item</h1>
            <ReactSVG
              src="/svg/icon-close.svg"
              className="cursor-pointer fill-Red p-2 hover:scale-110"
              onClick={backToShop}
            />
          </div>
          <ShopItemForm
            input={editInput}
            setInput={
              setEditInput as React.Dispatch<React.SetStateAction<ItemInfoType>>
            }
            onSubmit={handleEdit}
            error={error}
            setLoading={setLoading}
            newImages={newImages}
            setNewImages={setNewImages}
            currentImages={currentImages}
            setCurrentImages={setCurrentImages}
            defaultImg={defaultImg}
            setDefaultImg={setDefaultImg}
            item_id={editInput.item_id}
          />
          <SuccessModal
            successMessage={`You have successfully edited your item, ${editInput.item_name}!`}
            newLink={`/item/${editInput.item_id}`}
            showConfirmation={showModal}
            backToShop={backToShop}
          />
          <LoadingSpinner loading={loading} />
        </div>
      )}
    </>
  );
}

export default EditItem;
