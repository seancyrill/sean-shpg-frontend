import React, { useEffect, useRef, useState } from "react";
import ItemBubble from "../ItemBubble";
import { ItemInfoType } from "../../types/ShoppingCartContextTypes";
import logo from "/images/icon-logo.png";
import ItemImgsForm from "./ItemImgsForm";
import { ImgDefaultType, ImgType } from "../../types/ImgTypes";
import ItemTagsForm from "./ItemTagsForm";
import ItemAttributesForm from "./ItemAttributesForm";

type ShopItemFormType = {
  input: ItemInfoType;
  setInput: React.Dispatch<React.SetStateAction<ItemInfoType>>;
  onSubmit: () => Promise<void>;
  error: string | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  newImages: File[] | null;
  setNewImages: React.Dispatch<React.SetStateAction<File[] | null>>;
  currentImages: ImgType[] | null;
  defaultImg: ImgDefaultType;
  setDefaultImg: React.Dispatch<React.SetStateAction<ImgDefaultType>>;
  setCurrentImages?: React.Dispatch<React.SetStateAction<ImgType[] | null>>;
  item_id?: number;
};

function ShopItemForm({
  input,
  setInput,
  onSubmit,
  error,
  setLoading,
  newImages,
  setNewImages,
  currentImages,
  defaultImg,
  setDefaultImg,
  setCurrentImages,
  item_id,
}: ShopItemFormType) {
  const { item_desc, item_name, item_price, item_tags, item_attributes } =
    input;
  const [newImgPreview, setNewImgPreview] = useState<string[] | null>(null);

  //handles img url passed to the preview bubble
  const previewUrl = () => {
    if (defaultImg.imgStatus === "new") {
      const url = !newImgPreview?.length
        ? logo
        : newImgPreview[defaultImg.index];
      return url;
    }
    if (defaultImg.imgStatus === "existing") {
      const url = !currentImages?.length
        ? logo
        : currentImages.find(({ img_id }) => defaultImg.img_id === img_id)!
            .img_url;
      return url;
    }
    return logo;
  };
  const itemBubblePreview = {
    ...input,
    thumbnail_url: previewUrl(),
  };

  // handling price input and display
  const priceDisplay =
    item_price.toLocaleString() === "0" ? "" : item_price.toLocaleString();
  const [priceString, setPriceString] = useState(
    item_price ? `${item_price}` : ""
  );
  function priceStringChange(val: string) {
    const newPrice = val.replace(/,/g, "");
    const pattern = /^[\d]{0,5}(\.[\d]{0,2})?$/;
    if (pattern.test(newPrice)) {
      setPriceString(newPrice);
      setInput({
        ...input,
        item_price: +newPrice,
      });
    }
  }

  //auto focus in name input on load
  const [nameTip, setNameTip] = useState(false);
  const [priceTip, setPriceTip] = useState(false);
  const [descTip, setDescTip] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-1 flex-col-reverse md:flex-row">
      <form
        onSubmit={(e) => (e.preventDefault(), onSubmit())}
        className="flex flex-col gap-4 border-r p-6"
      >
        {error && (
          <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
            {error}
          </p>
        )}

        <h2>Be as descriptive as possible.</h2>

        <label className="off-screen">Name</label>
        <div className="input-field flex items-center justify-between gap-2">
          <input
            required
            type="text"
            ref={nameRef}
            value={item_name}
            placeholder="Item Name"
            onChange={(e) => setInput({ ...input, item_name: e.target.value })}
          />
          <button
            className="rounded-full bg-Grayish-blue px-2 text-sm text-White"
            onClick={(e) => (e.preventDefault(), setNameTip((prev) => !prev))}
          >
            i
          </button>
        </div>
        {nameTip && (
          <ul className="list-disc">
            <h1 className="text-sm font-bold">Item name</h1>
            <li className="ml-4 text-xs">Atleast 2 chars.</li>
            <li className="ml-4 text-xs">Must be unique</li>
          </ul>
        )}

        <label className="off-screen">Price</label>
        <div className="input-field flex items-center justify-between gap-2">
          <input
            required
            type="text"
            value={
              priceString.endsWith(".") ? `${priceDisplay}.` : priceDisplay
            }
            placeholder="Item Price"
            onChange={(e) => priceStringChange(e.target.value)}
          />

          <button
            className="rounded-full bg-Grayish-blue px-2 text-sm text-White"
            onClick={(e) => (e.preventDefault(), setPriceTip((prev) => !prev))}
          >
            i
          </button>
        </div>
        {priceTip && (
          <ul className="list-disc">
            <h1 className="text-sm font-bold">Item Price</h1>
            <li className="ml-4 text-xs">In USD</li>
            <li className="ml-4 text-xs">Up to 2 decimals.</li>
          </ul>
        )}

        <ItemImgsForm
          setLoading={setLoading}
          newImgPreview={newImgPreview}
          setNewImgPreview={setNewImgPreview}
          newImages={newImages}
          setNewImages={setNewImages}
          defaultImg={defaultImg}
          setDefaultImg={setDefaultImg}
          currentImages={currentImages}
          setCurrentImages={setCurrentImages}
          item_id={item_id}
        />

        <ItemTagsForm
          input={input}
          item_tags={item_tags || []}
          setInput={setInput}
        />

        <ItemAttributesForm
          item_attributes={item_attributes}
          input={input}
          setInput={setInput}
        />

        <label className="off-screen">Description</label>
        <div className="relative w-full">
          <textarea
            required
            value={item_desc}
            placeholder="Item Description"
            maxLength={250}
            className="input-field h-32 w-full"
            onChange={(e) => setInput({ ...input, item_desc: e.target.value })}
          />

          <button
            className="absolute right-0 top-0 mr-4 mt-4 rounded-full bg-Grayish-blue px-2 text-sm text-White"
            onClick={(e) => (e.preventDefault(), setDescTip((prev) => !prev))}
          >
            i
          </button>
        </div>
        {descTip && (
          <ul className="list-disc">
            <h1 className="text-sm font-bold">Item desciption</h1>
            <li className="ml-4 text-xs">Describe your item</li>
          </ul>
        )}

        <button type="submit" className="primary-button">
          {item_id ? "Save" : "Submit"}
        </button>
      </form>

      <div className="relative w-full bg-Light-grayish-blue p-4 pt-8">
        <p className="absolute left-0 top-1/2 m-4 -translate-x-1/2 -rotate-90 text-Dark-grayish-blue">
          Product preview
        </p>
        <ItemBubble item={itemBubblePreview} newTab={true} />
      </div>
    </div>
  );
}

export default ShopItemForm;
