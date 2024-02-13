import React, { useRef, useState } from "react";
import {
  AttributeType,
  ItemInfoType,
} from "../../types/ShoppingCartContextTypes";

type ItemAttributesFormType = {
  item_attributes: AttributeType[] | null;
  input: ItemInfoType;
  setInput: React.Dispatch<React.SetStateAction<ItemInfoType>>;
};

function ItemAttributesForm({
  item_attributes,
  input,
  setInput,
}: ItemAttributesFormType) {
  const MAX_ATTRIBUTES = 5;
  const [attrTip, setAttrTip] = useState(false);
  const [attributeInput, setAttributeInput] = useState<AttributeType>({
    attribute_name: "",
    attribute_value: "",
  } as AttributeType);
  const valueRef = useRef<HTMLInputElement>(null);

  function addAttr() {
    if (!attributeInput.attribute_name || !attributeInput.attribute_value)
      return;

    //check for duplicates
    if (
      item_attributes?.some(
        ({ attribute_name, attribute_value }) =>
          attribute_name === attributeInput.attribute_name &&
          attribute_value === attributeInput.attribute_value
      )
    ) {
      return setAttributeInput({ ...attributeInput, attribute_value: "" });
    }

    item_attributes
      ? setInput({
          ...input,
          item_attributes: [...item_attributes, attributeInput],
        })
      : setInput({ ...input, item_attributes: [attributeInput] });

    setAttributeInput({ ...attributeInput, attribute_value: "" });

    valueRef.current?.focus();
  }

  function removeAttr(toRemove: AttributeType) {
    if (!item_attributes) return;
    const newList = item_attributes.filter(
      ({ attribute_name, attribute_value }) =>
        !(
          attribute_name === toRemove.attribute_name &&
          attribute_value === toRemove.attribute_value
        )
    );

    setInput({
      ...input,
      item_attributes: newList,
    });
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      addAttr();
    }
  };

  return (
    <div className="input-field flex flex-col">
      <label className="mb-1 flex items-center justify-between border-b text-Dark-grayish-blue">
        Attributes (optional){" "}
        <button
          className="rounded-full bg-Grayish-blue px-2 text-sm text-White"
          onClick={(e) => (e.preventDefault(), setAttrTip((prev) => !prev))}
        >
          i
        </button>
      </label>
      {item_attributes && item_attributes.length > 0 && (
        <div className="mb-2 flex flex-col gap-2 border-b pb-2">
          {item_attributes.map((attr, i) => (
            <div
              className="smooth-animation relative flex w-fit border border-Very-dark-blue hover:bg-Soft-Red hover:text-White hover:line-through"
              onClick={() => removeAttr(attr)}
              key={i}
            >
              <p className="grid place-content-center bg-Very-dark-blue px-1 text-sm text-White">
                {attr.attribute_name}
              </p>
              <p className="grid place-content-center px-1 text-sm">
                {attr.attribute_value}
              </p>
              <span className="absolute right-0 top-0 -my-1 text-xs text-Soft-Red">
                x
              </span>
            </div>
          ))}
        </div>
      )}
      <div
        className={`flex gap-2 ${
          item_attributes &&
          item_attributes.length >= MAX_ATTRIBUTES &&
          "hidden"
        }`}
      >
        <div className="flex w-full flex-col gap-1">
          <input
            type="text"
            className={`w-full border border-Grayish-blue ${
              item_attributes && "border"
            } border-Grayish-blue px-2`}
            placeholder={`Name`}
            value={attributeInput.attribute_name}
            onChange={(e) =>
              setAttributeInput({
                ...attributeInput,
                attribute_name: e.target.value,
              })
            }
            onKeyDown={handleKeyPress}
          />
          <input
            type="text"
            ref={valueRef}
            className={`w-full border border-Grayish-blue ${
              item_attributes && "border"
            } border-Grayish-blue px-2`}
            placeholder={`Value`}
            value={attributeInput.attribute_value}
            onChange={(e) =>
              setAttributeInput({
                ...attributeInput,
                attribute_value: e.target.value,
              })
            }
            onKeyDown={handleKeyPress}
          />
          <button
            className={`secondary-button text-White ${
              (!attributeInput.attribute_name ||
                !attributeInput.attribute_value) &&
              "hidden"
            }`}
            onClick={(e) => (e.preventDefault(), addAttr())}
          >
            Add
          </button>
        </div>
      </div>
      {attrTip && (
        <ul className={`list-disc`}>
          <h1 className="text-sm font-bold">Product Attributes</h1>
          <li className="ml-4 text-xs">Different product types</li>
          <li className="ml-4 text-xs">eg. Size: XL / Model B: 2017 edition</li>
          <li className="ml-4 text-xs">No duplicates</li>
        </ul>
      )}
    </div>
  );
}

export default ItemAttributesForm;
