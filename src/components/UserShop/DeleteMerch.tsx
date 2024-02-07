import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useShopContext } from "../../pages/UserControls/UserShop";
import { ReactSVG } from "react-svg";
import useRefreshPage from "../../hooks/useRefreshPage";

type DeleteMerchType = {
  item_id: number;
};

function DeleteMerch({ item_id }: DeleteMerchType) {
  const { privateReq, shop_id } = useAuthContext();
  const { refreshPage } = useRefreshPage();
  const { setShopLoading } = useShopContext();

  const deleteModal = useRef<HTMLDialogElement>(null);
  const deleteConfirm = deleteModal.current!;
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (deleteConfirm) {
      openModal ? deleteConfirm.showModal() : deleteConfirm.close();
    }
  }, [openModal, deleteConfirm]);

  function handleBtn() {
    setOpenModal(true);
  }

  function handleCancel() {
    setOpenModal(false);
  }

  async function handleDelete() {
    setShopLoading(true);
    const relevantTable = "items";
    let success = false;
    try {
      await privateReq.delete("/items", {
        data: { item_id, shop_id, relevantTable },
      });
      setOpenModal(false);
      success = true;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    } finally {
      setShopLoading(false);
      success && refreshPage();
    }
  }

  return (
    <div>
      <button
        onClick={(e) => (e.preventDefault(), handleBtn())}
        className="secondary-button flex items-center gap-2 text-Soft-Red hover:scale-110 hover:text-Red"
      >
        <ReactSVG src="/svg/icon-delete.svg" className="fill-current" />
        <label>Delete</label>
      </button>

      <dialog ref={deleteModal} className="p-4">
        <p className="text-xl font-bold">Delete Item?</p>
        <p className="my-4">
          Are you sure you want to delete this Item? This will remove the Item
          and can't be undone
        </p>
        <div className="flex items-end justify-end gap-4">
          <button
            className="smooth-animation border-[1px] px-4 py-1 hover:scale-105 hover:opacity-90"
            onClick={(e) => (e.preventDefault(), handleCancel())}
          >
            NO, CANCEL
          </button>
          <button
            className="smooth-animation border-[1px] bg-Red px-4 py-1 text-White hover:scale-105 hover:opacity-90"
            onClick={(e) => (e.preventDefault(), handleDelete())}
          >
            YES, DELETE
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default DeleteMerch;
