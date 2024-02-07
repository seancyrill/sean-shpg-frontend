import { isAxiosError } from "axios";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import AddressBubble from "../../../components/UserInfo/AddressBubble";
import NewAddress from "../../../components/UserInfo/NewAddress";
import { useAuthContext } from "../../../context/AuthContext";

export type userAddressObjType = {
  address_id: number;
  address_name: string;
  address_number: string;
  address_region: string;
  address_postal: string;
  address_street: string;
  address_label: string;
};

function Addresses() {
  const { privateReq, user_id, setFetchErrModal, user_default_address_id } =
    useAuthContext();
  const [addressData, setAddressData] = useState([] as userAddressObjType[]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchSuccess, setFetchSuccess] = useState(false);

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
        setAddressData(response.data);
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

  return (
    <div>
      <div className="flex flex-row-reverse border-b bg-White p-2">
        <NewAddress
          addressData={addressData}
          setAddressData={setAddressData}
          setIsLoading={setIsLoading}
          fetchSuccess={fetchSuccess}
        />
      </div>

      {fetchSuccess && !addressData?.length ? (
        <p className="p-8 text-center">No address saved</p>
      ) : (
        <>
          {addressData?.map((address, i) => {
            return (
              <AddressBubble
                key={i}
                address={address}
                isDefault={address.address_id === user_default_address_id}
                setAddressData={setAddressData}
                setIsLoading={setIsLoading}
              />
            );
          })}
        </>
      )}
      <LoadingSpinner loading={isLoading} />
    </div>
  );
}

export default Addresses;
