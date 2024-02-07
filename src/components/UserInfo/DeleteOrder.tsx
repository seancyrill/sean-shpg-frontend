import { isAxiosError } from "axios";
import { useAuthContext } from "../../context/AuthContext";
import GenericDelete from "../GenericDelete";
import { OrdersDataType } from "../../types/OrderTypes";

type DeleteOrderType = {
  order_id: number;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOrdersData: React.Dispatch<React.SetStateAction<OrdersDataType[]>>;
};

function DeleteOrder({
  order_id,
  setIsLoading,
  setOrdersData,
}: DeleteOrderType) {
  const { privateReq, setFetchErrModal, user_id } = useAuthContext();

  async function handleDelete(order_id: number) {
    setIsLoading(true);
    try {
      const response = await privateReq.delete("/orders", {
        data: {
          order_id,
          user_id,
        },
      });
      setOrdersData(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
      setFetchErrModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  const modalContent = {
    head: "Delete Item?",
    body: `Are you sure you want to delete this Item? This will remove the Item
  and can't be undone`,
    confirm: "YES, DELETE",
    cancel: "NO, KEEP ORDER",
  };

  return (
    <GenericDelete
      handleDelete={() => handleDelete(order_id)}
      modalContent={modalContent}
    />
  );
}

export default DeleteOrder;
