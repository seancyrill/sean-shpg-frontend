import { MAX_QTY, MIN_QTY } from "../context/ShoppingCartContext";

function useQtyChecker() {
  function checkVal(quantity: number) {
    let val = quantity;

    if (quantity > MAX_QTY) {
      val = MAX_QTY;
    }
    if (quantity < MIN_QTY) {
      val = MIN_QTY;
    }
    return val;
  }
  return checkVal;
}

export default useQtyChecker;
