import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

type ShopSettingInputFieldType = {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  defaultVal: string;
  header: string;
  handleSave: () => Promise<void>;
  regexPattern: RegExp;
};

function ShopSettingInputField({
  state,
  setState,
  defaultVal,
  header,
  handleSave,
  regexPattern,
}: ShopSettingInputFieldType) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputErrors, setInputErrors] = useState<string | null>(null);

  function toggleInputOn() {
    setIsEditing(true);
  }

  function toggleInputOff() {
    setIsEditing(false);
    setState(defaultVal);
  }

  async function handleSubmit() {
    try {
      console.log("trying2");
      await handleSave();
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.data?.message) {
          setInputErrors(error.response?.data?.message);
        }
        if (error.config?.signal?.aborted) return;
      } else {
        console.error(error);
      }
    }
  }

  //name format checker
  useEffect(() => {
    const testInput = regexPattern.test(state);
    const errMsg = "Invalid format";
    testInput ? setInputErrors(null) : setInputErrors(errMsg);
  }, [state]);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => (e.preventDefault(), handleSubmit())}
    >
      <div className="flex items-center justify-between gap-4 border-b pl-4">
        <label className="text-Grayish-blue">{header}</label>
        {inputErrors && (
          <p className="border border-Soft-Red px-1 text-center text-Soft-Red">
            {inputErrors}
          </p>
        )}
      </div>

      <div className="flex flex-col justify-between">
        {!isEditing ? (
          <div className="flex items-center justify-between px-4 py-2 text-lg font-semibold">
            {state}
            <ReactSVG
              src="/svg/icon-edit.svg"
              className="smooth-animation rounded-full border fill-Orange p-2 hover:scale-90 hover:cursor-pointer hover:fill-Moderate-blue"
              onClick={toggleInputOn}
            />
          </div>
        ) : (
          <input
            type={header === "Email" ? "email" : "text"}
            className={`input-field text-lg font-semibold ${
              inputErrors && "border-Soft-Red focus:outline-none"
            } `}
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        )}
      </div>
      {isEditing && (
        <div className="flex flex-row-reverse justify-between gap-4">
          <button
            className="primary-button disabled:blur disabled:saturate-0"
            type="submit"
            disabled={inputErrors !== null}
          >
            Save
          </button>
          <button
            className="secondary-button text-White"
            onClick={toggleInputOff}
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}

export default ShopSettingInputField;
