import GenericDelete from "../GenericDelete";
import { ItemInfoType } from "../../types/ShoppingCartContextTypes";
import { useAuthContext } from "../../context/AuthContext";
import { isAxiosError } from "axios";

type DeletePromoType = {
  item: ItemInfoType;
  onDelete: () => void;
};

function DeletePromo({ item, onDelete }: DeletePromoType) {
  const { privateReq, shop_id, setFetchErrModal } = useAuthContext();
  const { item_name, item_id } = item;
  const modalContent = {
    head: "Clear Promo?",
    body: `Are you sure you want to remove associated promo for ${item_name}`,
    confirm: "Yes, Remove",
    cancel: "No, Cancel",
  };

  async function handleDelete() {
    try {
      await privateReq.delete("/promo", {
        data: { item_id, shop_id },
      });
      onDelete();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
      setFetchErrModal(true);
    }
  }

  return (
    <GenericDelete
      modalContent={modalContent}
      buttonText="Clear Promos"
      full={true}
      handleDelete={handleDelete}
    />
  );
}

export default DeletePromo;
