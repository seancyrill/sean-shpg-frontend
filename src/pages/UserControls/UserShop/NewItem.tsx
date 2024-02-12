import { isAxiosError } from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import ShopItemForm from "../../../components/UserShop/ShopItemForm";
import { ItemInfoType } from "../../../types/ShoppingCartContextTypes";
import { ReactSVG } from "react-svg";
import SuccessModal from "../../../components/UserShop/SuccessModal";
import { ImgDefaultType } from "../../../types/ImgTypes";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useImgControls from "../../../hooks/useImgControls";

function NewItem() {
  const { privateReq, shop_id } = useAuthContext();
  const { setItemDefaultImg, handleImgUpload } = useImgControls();

  //form
  const initInput = {
    item_name: "",
    item_desc: "",
    item_price: 0,
    item_tags: [] as string[],
    shop_id,
  };

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(initInput as ItemInfoType);
  const [newImages, setNewImages] = useState<File[] | null>(null);
  const [defaultImg, setDefaultImg] = useState<ImgDefaultType>({
    imgStatus: "new",
    index: 0,
  });
  const itemIdRef = useRef(0);

  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const postNewItem = await privateReq.post("/items", input);
      const { newItemId } = postNewItem.data;
      if (newImages) {
        const addedIds = await handleImgUpload({
          newImages,
          relevantId: newItemId,
          relevantTable: "items",
          rounds: newImages.length,
        });
        if (addedIds === undefined) return;
        if (defaultImg.imgStatus === "new") {
          const { img_id } = addedIds[defaultImg.index];
          await setItemDefaultImg(img_id, newItemId);
        }
      }
      itemIdRef.current = newItemId;
      setShowModal(true);
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
  }

  const navigate = useNavigate();
  function backToShop() {
    setShowModal(false);
    navigate("/controls/shop");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b p-8">
        <h1 className="text-2xl font-bold">Add new Item</h1>

        <ReactSVG
          src="/svg/icon-close.svg"
          className="cursor-pointer fill-Red p-2 hover:scale-110"
          onClick={backToShop}
        />
      </div>

      <ShopItemForm
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        error={error}
        setLoading={setLoading}
        newImages={newImages}
        setNewImages={setNewImages}
        currentImages={null}
        defaultImg={defaultImg}
        setDefaultImg={setDefaultImg}
      />

      <SuccessModal
        successMessage={`You have added a new product, ${input.item_name}!`}
        newLink={`/item/${itemIdRef.current}`}
        showConfirmation={showModal}
        backToShop={backToShop}
      />

      <LoadingSpinner loading={loading} />
    </div>
  );
}

export default NewItem;
