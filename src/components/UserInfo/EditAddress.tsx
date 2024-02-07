import { useEffect, useRef, useState } from "react";
import AddressForm from "./AddressForm";
import { ReactSVG } from "react-svg";
import { useAuthContext } from "../../context/AuthContext";
import { isAxiosError } from "axios";
import { userAddressObjType } from "../../pages/UserControls/UserInfo/Addresses";

type EditAddressType = {
  toEdit: userAddressObjType;
  isDefault: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddressData: React.Dispatch<React.SetStateAction<userAddressObjType[]>>;
};

function EditAddress({
  toEdit,
  setIsLoading,
  isDefault,
  setAddressData,
}: EditAddressType) {
  const {
    user_id,
    privateReq,
    setFetchErrModal,
    user_default_address_id,
    refreshAccessToken,
  } = useAuthContext();
  const { address_id } = toEdit;

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
    setInput(toEdit);
    setShowModal(true);
  }

  //form
  const [input, setInput] = useState<userAddressObjType>(toEdit);
  const [toDefault, setToDefault] = useState(isDefault);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const response = await privateReq.patch("/address", {
        user_address: input,
        address_id,
        user_id,
        toDefault,
      });
      setShowModal(false);
      setAddressData(response.data);
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

  //resets input when the entries are reordered
  useEffect(() => {
    if (input.address_id !== toEdit.address_id) {
      setInput(toEdit);
      setToDefault(isDefault);
    }
  }, [toEdit]);

  //autofocus on load
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  return (
    <>
      <button
        onClick={(e) => (e.preventDefault(), handleButton())}
        className="secondary-button flex items-center gap-2 text-White hover:text-Orange"
      >
        <ReactSVG src="/svg/icon-edit.svg" className="fill-current" />
        <p className="hidden md:block">Edit</p>
      </button>

      <dialog ref={modalRef} onCancel={() => setShowModal(false)}>
        <AddressForm
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          setShowModal={setShowModal}
          toDefault={toDefault}
          setToDefault={setToDefault}
          forceDefault={address_id === user_default_address_id}
        />
      </dialog>
    </>
  );
}

export default EditAddress;
