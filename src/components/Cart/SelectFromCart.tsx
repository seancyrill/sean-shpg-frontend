import useCartControl from "../../hooks/useCartControl";
import { CartItemInfoType } from "../../types/ShoppingCartContextTypes";
import { useAuthContext } from "../../context/AuthContext";

type SelectFromCartType = {
  item: CartItemInfoType;
};
function SelectFromCart({ item }: SelectFromCartType) {
  const { setFetchErrModal } = useAuthContext();
  const { updateCart } = useCartControl();
  const { item_id, quantity, checkout } = item;

  async function handleUpdate() {
    try {
      await updateCart(item_id, quantity, !checkout);
    } catch (error) {
      setFetchErrModal(true);
    }
  }

  return (
    <button
      onClick={(e) => (e.preventDefault(), handleUpdate())}
      className={`smooth-animation grid place-content-center ${
        checkout ? "primary-button" : "secondary-button text-Soft-Red"
      }`}
    >
      {checkout ? (
        <p>✔</p>
      ) : (
        <div className="my-1 h-3 w-3 border-2 border-Soft-Red" />
      )}
    </button>
  );
}

export default SelectFromCart;
