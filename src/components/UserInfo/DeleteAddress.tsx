import { isAxiosError } from "axios";
import { useAuthContext } from "../../context/AuthContext";
import GenericDelete from "../GenericDelete";
import { userAddressObjType } from "../../pages/UserControls/UserInfo/Addresses";

type DeleteAddressType = {
  address_id: number;
  isDefault: boolean;
  setAddressData: React.Dispatch<React.SetStateAction<userAddressObjType[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteAddress({
  address_id,
  isDefault,
  setAddressData,
  setIsLoading,
}: DeleteAddressType) {
  const { privateReq, user_id } = useAuthContext();

  async function handleDelete() {
    setIsLoading(true);
    try {
      const response = await privateReq.delete("/address", {
        data: { address_id, user_id },
      });
      setAddressData(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const modalContent = {
    head: "Delete Address?",
    body: `Are you sure you want to delete this Address? This will remove the Address
  and can't be undone`,
    confirm: "YES, DELETE",
    cancel: "NO, KEEP ADDRESS",
  };

  return (
    <GenericDelete
      handleDelete={() => handleDelete()}
      modalContent={modalContent}
      full={true}
      disable={isDefault}
    />
  );
}

export default DeleteAddress;
