import { useEffect, useRef, useState } from "react";
import AddressForm from "./AddressForm";
import { ReactSVG } from "react-svg";
import { isAxiosError } from "axios";
import { useAuthContext } from "../../context/AuthContext";
import { userAddressObjType } from "../../pages/UserControls/UserInfo/Addresses";

type NewAddressType = {
  addressData: userAddressObjType[];
  setAddressData: React.Dispatch<React.SetStateAction<userAddressObjType[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSuccess: boolean;
  asSecondary?: boolean;
};

function NewAddress({
  addressData,
  setAddressData,
  setIsLoading,
  fetchSuccess,
  asSecondary,
}: NewAddressType) {
  const { privateReq, user_id, setFetchErrModal, refreshAccessToken } =
    useAuthContext();
  //modal
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const addressModal = modalRef.current;
    if (addressModal) {
      showModal ? addressModal.showModal() : addressModal.close();
    }
  }, [showModal]);

  function handleButton() {
    setInput(emptyInput);
    setShowModal(true);
  }

  //form
  const emptyInput = {
    address_name: "",
    address_number: "",
    address_region: "",
    address_postal: "",
    address_street: "",
    address_label: "",
  } as userAddressObjType;
  const [input, setInput] = useState(emptyInput);
  const [toDefault, setToDefault] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const response = await privateReq.post("/address", {
        user_address: input,
        user_id,
        toDefault,
      });
      setShowModal(false);
      setAddressData(response.data);
      setInput(emptyInput);
      refreshAccessToken();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
      setFetchErrModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={(e) => (e.preventDefault(), handleButton())}
        className={`flex items-center gap-2 ${
          asSecondary ? "secondary-button" : "primary-button"
        }`}
      >
        <ReactSVG src="/svg/icon-plus.svg" className="fill-current" />
        Add New Address
      </button>

      <dialog ref={modalRef} onCancel={() => setShowModal(false)}>
        <AddressForm
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          setShowModal={setShowModal}
          toDefault={toDefault}
          setToDefault={setToDefault}
          forceDefault={fetchSuccess && !addressData?.length}
        />
      </dialog>
    </>
  );
}

export default NewAddress;
