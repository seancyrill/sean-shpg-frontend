import { useEffect, useRef } from "react";
import { ReactSVG } from "react-svg";
import GenericCheckbox from "../GenericCheckbox";
import { userAddressObjType } from "../../pages/UserControls/UserInfo/Addresses";

type AddressFormType = {
  input: userAddressObjType;
  setInput: React.Dispatch<React.SetStateAction<userAddressObjType>>;
  toDefault: boolean;
  setToDefault: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (toAdd: userAddressObjType) => Promise<void>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  forceDefault?: boolean;
};

function AddressForm({
  input,
  setInput,
  onSubmit,
  setShowModal,
  toDefault,
  setToDefault,
  forceDefault,
}: AddressFormType) {
  const {
    address_label,
    address_name,
    address_number,
    address_postal,
    address_region,
    address_street,
  } = input;
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  async function handleSubmit() {
    await onSubmit(input);
  }

  function handleCancel() {
    setShowModal(false);
  }

  //auto sets to default on first address
  useEffect(() => {
    if (forceDefault) {
      setToDefault(true);
    }
  }, [forceDefault]);

  return (
    <form
      onSubmit={(e) => (e.preventDefault(), handleSubmit())}
      className="flex min-w-[320px] flex-col"
    >
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-2xl font-bold">New Address</h1>
        <button
          onClick={(e) => (e.preventDefault(), handleCancel())}
          className="text-Soft-Red hover:scale-110 hover:text-Red"
        >
          <ReactSVG src="/svg/icon-close.svg" className="fill-current" />
        </button>
      </header>
      <fieldset className="flex flex-col gap-4 p-4">
        <label className="off-screen">Name</label>
        <input
          required
          ref={nameRef}
          value={address_name}
          onChange={(e) => setInput({ ...input, address_name: e.target.value })}
          placeholder="Name"
          type="text"
          className="input-field"
        />

        <label className="off-screen">Contact Number</label>
        <input
          required
          value={address_number}
          onChange={(e) => {
            const val = e.target.value;
            return /^\d{1,11}$/.test(val) || val === ""
              ? setInput({ ...input, address_number: e.target.value })
              : e;
          }}
          placeholder="Contact Number"
          type="text"
          className="input-field"
        />

        <label className="off-screen">Region, Province, City</label>
        <input
          required
          value={address_region}
          onChange={(e) =>
            setInput({ ...input, address_region: e.target.value })
          }
          placeholder="Region, Province, City"
          type="text"
          className="input-field"
        />

        <label className="off-screen">Street Name, Building, House No.</label>
        <input
          required
          value={address_street}
          onChange={(e) =>
            setInput({ ...input, address_street: e.target.value })
          }
          placeholder="Street Name, Building, House No"
          type="text"
          className="input-field"
        />

        <label className="off-screen">Postal Code</label>
        <input
          required
          value={address_postal}
          onChange={(e) =>
            setInput({ ...input, address_postal: e.target.value })
          }
          placeholder="Postal Code"
          type="text"
          className="input-field"
        />
      </fieldset>

      <fieldset className="flex flex-col gap-2 px-4">
        <h2 className="font-semibold">Label as:</h2>

        <div className="flex gap-2">
          <label
            className={`cursor-pointer border px-4 py-2 hover:opacity-70 ${
              address_label === "Home"
                ? "border-Orange text-Orange"
                : "border-Very-dark-blue text-Very-dark-blue"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              id="label"
              checked={address_label === "Home"}
              onChange={() =>
                setInput(({ address_label }) =>
                  address_label === "Home"
                    ? { ...input, address_label: "" }
                    : { ...input, address_label: "Home" }
                )
              }
            />
            Home
          </label>
          <label
            className={`cursor-pointer border px-4 py-2 hover:opacity-70 ${
              address_label === "Work"
                ? "border-Orange text-Orange"
                : "border-Very-dark-blue text-Very-dark-blue"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              id="label"
              checked={address_label === "Work"}
              onChange={() =>
                setInput(({ address_label }) =>
                  address_label === "Work"
                    ? { ...input, address_label: "" }
                    : { ...input, address_label: "Work" }
                )
              }
            />
            Work
          </label>
          <label
            className={`cursor-pointer border px-4 py-2 hover:opacity-70 ${
              address_label === "Other"
                ? "border-Orange text-Orange"
                : "border-Very-dark-blue text-Very-dark-blue"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              id="label"
              checked={address_label === "Other"}
              onChange={() =>
                setInput(({ address_label }) =>
                  address_label === "Other"
                    ? { ...input, address_label: "" }
                    : { ...input, address_label: "Other" }
                )
              }
            />
            Other
          </label>
        </div>
      </fieldset>

      <fieldset>
        <GenericCheckbox
          checked={toDefault}
          label="Set as Default Address"
          onClick={() => setToDefault((prev) => !prev)}
          disabled={forceDefault}
        />
      </fieldset>

      <button type="submit" className="primary-button m-4">
        Submit
      </button>
    </form>
  );
}

export default AddressForm;
