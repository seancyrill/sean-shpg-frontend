import { useState } from "react";
import { MAX_QTY, MIN_QTY } from "../../context/ShoppingCartContext";
import useCartControl from "../../hooks/useCartControl";
import { useAuthContext } from "../../context/AuthContext";
import useQtyChecker from "../../utilities/useQtyChecker";

type CartItemQtyType = {
  item_id: number;
  quantity: number;
  checkout: boolean;
};

function CartItemQty({ item_id, quantity, checkout }: CartItemQtyType) {
  const { setFetchErrModal } = useAuthContext();
  const { updateCart } = useCartControl();
  const checkVal = useQtyChecker();

  const handleUpdate = async (qty: number) => {
    try {
      await updateCart(item_id, qty, checkout);
    } catch (error) {
      setFetchErrModal(true);
    }
  };

  const [val, setVal] = useState(quantity);
  async function editQty() {
    if (quantity !== val) {
      handleUpdate(val);
    }
  }

  function addOne() {
    const newQty = quantity + 1;
    setVal(newQty);
    handleUpdate(newQty);
  }

  function lessOne() {
    const newQty = quantity - 1;
    setVal(newQty);
    handleUpdate(newQty);
  }

  return (
    <div className="flex w-full max-w-[150px] items-center justify-between rounded-xl bg-Light-grayish-blue">
      <input
        type="image"
        disabled={quantity === MIN_QTY}
        onClick={lessOne}
        src="/svg/icon-minus.svg"
        alt="add1Item"
        className="cursor-pointer border-r object-contain p-4 hover:opacity-50 "
      />

      <input
        type="number"
        name="toCart"
        id="toCart"
        value={val}
        onChange={(e) => setVal(checkVal(+e.target.value))}
        onBlur={editQty}
        className="max-w-[50px] bg-White bg-none py-1 text-center"
      />

      <input
        type="image"
        disabled={quantity === MAX_QTY}
        onClick={addOne}
        src="/svg/icon-plus.svg"
        alt="less1Item"
        className="cursor-pointer border-l object-contain p-4 hover:opacity-50 "
      />
    </div>
  );
}

export default CartItemQty;
