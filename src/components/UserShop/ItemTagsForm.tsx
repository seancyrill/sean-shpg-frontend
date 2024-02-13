import React, { useRef, useState } from "react";
import { ItemInfoType } from "../../types/ShoppingCartContextTypes";

type ItemTagsFormType = {
  item_tags: string[];
  input: ItemInfoType;
  setInput: React.Dispatch<React.SetStateAction<ItemInfoType>>;
};

function ItemTagsForm({ item_tags, input, setInput }: ItemTagsFormType) {
  const MAX_CHARS = 20;
  const MAX_TAGS = 4;

  const [tagInput, setTagInput] = useState("");
  const [tagTip, setTagTip] = useState(false);
  const tagRef = useRef<HTMLInputElement>(null);
  function handleTagInput(val: string) {
    setTagInput(val.replace(" ", "").slice(0, MAX_CHARS));
  }
  function addTags() {
    const duplicate = item_tags.find((tag) => tag === tagInput);
    if (duplicate) return;

    const newTags = [...item_tags, tagInput.toLocaleLowerCase()].slice(
      0,
      MAX_TAGS
    );
    setInput({ ...input, item_tags: newTags });
    setTagInput("");
  }

  function removeTag(val: string) {
    const newTags = item_tags.filter((tag) => tag !== val);
    setInput({ ...input, item_tags: newTags });
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      addTags();
    }
  };

  return (
    <div
      className="input-field flex flex-col "
      onClick={() => tagRef.current?.focus()}
    >
      <label className="mb-1 flex items-center justify-between border-b text-Dark-grayish-blue">
        Tags
        <button
          className="rounded-full bg-Grayish-blue px-2 text-sm text-White"
          onClick={(e) => (e.preventDefault(), setTagTip((prev) => !prev))}
        >
          i
        </button>
      </label>
      {item_tags.length > 0 && (
        <div className="mb-2 flex gap-2 border-b pb-2">
          {item_tags.map((tag, i) => (
            <div
              className="smooth-animation relative flex w-fit items-center whitespace-nowrap border border-Very-dark-blue px-1 hover:bg-Soft-Red hover:text-White hover:line-through"
              onClick={() => removeTag(tag)}
              key={i}
            >
              {tag}
              <span className="absolute right-0 top-0 -my-1 text-xs text-Soft-Red">
                x
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={`flex gap-2 ${item_tags.length >= MAX_TAGS && "hidden"}`}>
        <input
          type="text"
          ref={tagRef}
          className={`min-w-0 flex-1 border focus:outline-none ${
            item_tags.length > 0 && "border"
          } border-Grayish-blue px-2`}
          value={tagInput}
          placeholder={`Add tags`}
          onChange={(e) => handleTagInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
          className={`secondary-button text-White ${!tagInput && "hidden"}`}
          onClick={(e) => (e.preventDefault(), addTags())}
        >
          Add
        </button>
      </div>
      {tagTip && (
        <ul className="mt-2 list-disc">
          <h1 className="text-sm font-bold">Item name</h1>
          <li className="ml-4 text-xs">
            Help customers find your product. Includes item in categories
          </li>
          <li className="ml-4 text-xs">Try to keep it generic</li>
          <li className="ml-4 text-xs">{`Up to ${MAX_TAGS} tags`}</li>
          <li className="ml-4 text-xs">eg. shoes / men / sports</li>
          <li className="ml-4 text-xs">No duplicates</li>
        </ul>
      )}
    </div>
  );
}

export default ItemTagsForm;
