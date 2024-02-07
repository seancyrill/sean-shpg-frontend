import { userAddressObjType } from "../../pages/UserControls/UserInfo/Addresses";
import DeleteAddress from "./DeleteAddress";
import EditAddress from "./EditAddress";
import SetDefaultAddress from "./SetDefaultAddress";

type AddressBubbleType = {
  address: userAddressObjType;
  isDefault: boolean;
  setAddressData: React.Dispatch<React.SetStateAction<userAddressObjType[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddressBubble({
  address,
  isDefault,
  setAddressData,
  setIsLoading,
}: AddressBubbleType) {
  const {
    address_id,
    address_label,
    address_name,
    address_number,
    address_postal,
    address_region,
    address_street,
  } = address;

  return (
    <article
      className={`flex flex-1 border-b-4 border-White p-2 md:p-4 ${
        !isDefault && "bg-Light-grayish-blue"
      }`}
    >
      <div className="flex w-full flex-col justify-around">
        <p className="flex flex-col">
          <span className="text-2xl font-bold uppercase">{address_name}</span>
          <span className="text-Orange">{address_label}</span>
        </p>
        <p className="flex flex-col">
          <span className="font-light tracking-wider">{address_number}</span>
          <span className="tracking-wide">{`${address_region}, ${address_street}, ${address_postal}`}</span>
        </p>
      </div>

      <div className={`flex flex-col gap-2`}>
        <SetDefaultAddress
          isDefault={isDefault}
          address_id={address_id}
          setIsLoading={setIsLoading}
        />

        <EditAddress
          toEdit={address}
          isDefault={isDefault}
          setIsLoading={setIsLoading}
          setAddressData={setAddressData}
        />

        <DeleteAddress
          isDefault={isDefault}
          address_id={address_id}
          setAddressData={setAddressData}
          setIsLoading={setIsLoading}
        />
      </div>
    </article>
  );
}

export default AddressBubble;
