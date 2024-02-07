import GenericDelete from "../GenericDelete";
import useCartControl from "../../hooks/useCartControl";
import { CartItemInfoType } from "../../types/ShoppingCartContextTypes";
import { useAuthContext } from "../../context/AuthContext";

type DeleteFromCartType = {
  item: CartItemInfoType;
};
function DeleteFromCart({ item }: DeleteFromCartType) {
  const { setFetchErrModal } = useAuthContext();
  const { deleteInCart } = useCartControl();

  async function handleDelete() {
    try {
      deleteInCart([item]);
    } catch (error) {
      setFetchErrModal(true);
    }
  }

  const modalContent = {
    head: "Delete Item?",
    body: `Are you sure you want to delete this Item? This will remove the Item
  and can't be undone`,
    confirm: "YES, REMOVE ITEM",
    cancel: "NO, CANCEL",
  };
  return (
    <GenericDelete modalContent={modalContent} handleDelete={handleDelete} />
  );
}

export default DeleteFromCart;
