import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner";
import AddressBubble from "../UserInfo/AddressBubble";
import NewAddress from "../UserInfo/NewAddress";
import { ReactSVG } from "react-svg";
import GenericCheckbox from "../GenericCheckbox";
import { userAddressObjType } from "../../pages/UserControls/UserInfo/Addresses";

type CheckOutAddressType = {
  selectedAddress: userAddressObjType | null;
  setSelectedAddress: React.Dispatch<
    React.SetStateAction<userAddressObjType | null>
  >;
};

function CheckOutAddress({
  selectedAddress,
  setSelectedAddress,
}: CheckOutAddressType) {
  const { privateReq, user_id, setFetchErrModal, user_default_address_id } =
    useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [addressData, setAddressData] = useState([] as userAddressObjType[]);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [addressRadio, setAddressRadio] = useState<number | undefined>(
    undefined
  );

  //// fetch data ////
  useEffect(() => {
    const controller = new AbortController();

    async function fetchaddressData() {
      try {
        const response = await privateReq.get("/address", {
          signal: controller.signal,
          params: {
            user_id,
          },
        });
        const addressArr: userAddressObjType[] = response.data;
        setAddressData(addressArr);

        //set selected address upon completing api call
        if (addressArr && addressArr?.length) {
          const findDefault = addressArr?.find(
            ({ address_id }) => address_id === user_default_address_id
          );
          if (findDefault) {
            setSelectedAddress(findDefault);
            setAddressRadio(findDefault.address_id);
          }
        }

        setFetchSuccess(true);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.config?.signal?.aborted) return;
          console.error(error.response?.data);
        } else {
          console.error(error);
        }
        setFetchSuccess(false);
        setFetchErrModal(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (user_id) {
      fetchaddressData();
    }

    return () => {
      controller.abort();
    };
  }, [user_id]);

  //// Addresses modal ////
  const modalRef = useRef<HTMLDialogElement>(null);
  const addressModal = modalRef.current!;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (addressModal) {
      showModal ? addressModal.showModal() : addressModal.close();
    }
  }, [showModal, addressModal, modalRef]);

  function handleOpen() {
    setShowModal(true);
  }

  function handleCancel() {
    setShowModal(false);
  }

  function handleConfirm() {
    const findSelected = addressData?.find(
      ({ address_id }) => address_id === addressRadio
    )!;
    setSelectedAddress(findSelected);
    setShowModal(false);
  }

  return (
    <>
      <LoadingSpinner loading={isLoading} />

      <div className="border bg-gradient-address py-1">
        <div className="flex flex-col gap-4 bg-White p-4 shadow-md">
          <h1 className="flex gap-2 text-Orange ">
            <ReactSVG src="/svg/icon-location.svg" className="fill-current" />
            Delivery Address
          </h1>

          <div className="flex items-center justify-between gap-8">
            {!selectedAddress ? (
              <p className="text-center">No address saved</p>
            ) : (
              <div className="flex-1">
                <h2 className="font-bold uppercase">
                  {selectedAddress.address_name}
                </h2>
                <p>{selectedAddress.address_number}</p>
                <p className="capitalize">{`${selectedAddress.address_region}, ${selectedAddress.address_street}, ${selectedAddress.address_postal}`}</p>
              </div>
            )}
            <button
              onClick={(e) => (e.preventDefault(), handleOpen())}
              className="secondary-button h-fit text-White hover:text-Orange"
            >
              Change
            </button>
          </div>
        </div>

        <dialog
          ref={modalRef}
          className="w-[95%] min-w-[320px] max-w-lg rounded-xl shadow-md"
          onCancel={handleCancel}
        >
          <header className="flex items-center justify-between border-b p-4">
            <h1 className="font-lg font-semibold">My Addresses</h1>
            <button className="text-Soft-Red hover:scale-110 hover:text-Red">
              <ReactSVG
                src="/svg/icon-close.svg"
                className="fill-current"
                onClick={handleCancel}
              />
            </button>
          </header>
          <div id="selectAddress">
            {!addressData?.length ? (
              <p className="p-8 text-center">No address saved</p>
            ) : (
              <>
                {addressData.map((address, i) => {
                  const isDefault =
                    address.address_id === user_default_address_id;
                  const isSelected = addressRadio === address.address_id;
                  return (
                    <div
                      key={i}
                      className={`smooth-animation flex items-center ${
                        !isDefault && "bg-Light-grayish-blue"
                      } ${isSelected && "border border-Orange"}`}
                    >
                      <div>
                        <GenericCheckbox
                          checked={isSelected}
                          label=""
                          onClick={() => setAddressRadio(address.address_id)}
                        />
                      </div>
                      <div className="-ml-4 flex-1">
                        <AddressBubble
                          key={i}
                          address={address}
                          isDefault={isDefault}
                          setAddressData={setAddressData}
                          setIsLoading={setIsLoading}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            <div className="mt-2 flex justify-between border-y px-4 py-2 pb-4 text-White">
              <NewAddress
                addressData={addressData}
                setAddressData={setAddressData}
                setIsLoading={setIsLoading}
                fetchSuccess={fetchSuccess}
                asSecondary={true}
              />
              <button
                onClick={(e) => (e.preventDefault(), handleConfirm())}
                className="primary-button px-6"
              >
                Confirm
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}

export default CheckOutAddress;
