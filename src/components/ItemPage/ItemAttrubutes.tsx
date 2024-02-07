import { AttributeType } from "../../types/ShoppingCartContextTypes";

type ItemAttrubutesType = {
  item_attributes: AttributeType[] | null;
  option: AttributeType | null;
  setOption: React.Dispatch<React.SetStateAction<AttributeType | null>>;
};

function ItemAttrubutes({
  item_attributes,
  option,
  setOption,
}: ItemAttrubutesType) {
  function optionClick(id: AttributeType) {
    setOption(id);
  }
  return (
    <>
      {item_attributes !== null && item_attributes?.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border px-4 py-2">
          <h1 className="text-Grayish-blue">OPTIONS (choose 1)</h1>
          <div className="grid-auto-sm grid place-content-center gap-4">
            {item_attributes.map((attr, i) => {
              const { attribute_name, attribute_value, attribute_id } = attr;
              return (
                <div
                  onClick={() => optionClick(attr)}
                  className={`smooth-animation m-auto flex w-fit cursor-pointer items-center border ${
                    attribute_id === option?.attribute_id
                      ? "border-4 border-Orange"
                      : "border-Very-dark-blue"
                  }`}
                  key={i}
                >
                  <p
                    className={`smooth-animation px-2 ${
                      attribute_id === option?.attribute_id
                        ? "bg-Orange text-Very-dark-blue"
                        : "bg-Very-dark-blue text-White"
                    }`}
                  >
                    {attribute_name}
                  </p>
                  <p
                    className={`smooth-animation px-2 ${
                      attribute_id === option?.attribute_id && "text-Orange"
                    }`}
                  >
                    {attribute_value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default ItemAttrubutes;
