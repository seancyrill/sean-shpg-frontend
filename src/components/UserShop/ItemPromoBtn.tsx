import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

type ItemPromoBtnType = {
  item_id: number;
};

function ItemPromoBtn({ item_id }: ItemPromoBtnType) {
  return (
    <Link
      to={`/controls/shop/newpromo/${item_id}`}
      className="flex items-center gap-2 whitespace-nowrap border bg-Very-dark-blue px-4 py-2 text-White shadow-md hover:scale-110 hover:text-Orange"
    >
      <ReactSVG src="/svg/icon-plus.svg" className="fill-current" />
      Promo
    </Link>
  );
}

export default ItemPromoBtn;
