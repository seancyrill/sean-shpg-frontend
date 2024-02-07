import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

type EditMerchBtnType = {
  item_id: number;
};

function EditMerchBtn({ item_id }: EditMerchBtnType) {
  return (
    <Link
      to={`/controls/shop/edititem/${item_id}`}
      className="flex items-center gap-2 whitespace-nowrap border bg-Very-dark-blue px-4 py-2 text-White shadow-md hover:scale-110 hover:text-Orange"
    >
      <ReactSVG src="/svg/icon-edit.svg" className="fill-current" />
      Edit
    </Link>
  );
}

export default EditMerchBtn;
