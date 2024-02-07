import { useAuthContext } from "../context/AuthContext";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem, CartItemInfoType } from "../types/ShoppingCartContextTypes";
import useQtyChecker from "../utilities/useQtyChecker";

function useCartControl() {
  const { user_id, token, privateReq } = useAuthContext();
  const { cartItem, anonItem, setCartItem, setAnonItem, setCartLoading } =
    useShoppingCart();

  const checkVal = useQtyChecker();

  //root function for updating user cart
  const userReq = async (newCartList: CartItem[]) => {
    try {
      setCartLoading(true);
      const response = await privateReq.patch("/users/cart", {
        user_id,
        cartArray: newCartList,
      });
      setCartItem(response.data?.user_cart);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setCartLoading(false);
    }
  };

  //root function for updating anon cart
  const anonReq = async (newCartList: CartItem[]) => {
    setAnonItem(newCartList);
    localStorage.setItem("anontItems", JSON.stringify(newCartList));
  };

  //global variables
  const state = !token ? anonItem : cartItem;
  const sendReq = !token ? anonReq : userReq;

  ////add
  function addToCart(cartArr: CartItemInfoType[] | CartItem[]) {
    let newCartList = [...state];
    cartArr.map((itemObj) => {
      const { item_id, quantity } = itemObj;
      const itemExist = newCartList.some((item) => item_id === item.item_id);

      const insertItem = !itemExist
        ? newCartList.push(itemObj)
        : (newCartList = newCartList.map((item) =>
            item.item_id === item_id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ));
      return insertItem;
    });
    return sendReq(newCartList);
  }

  ////delete
  function deleteInCart(cartArr: CartItemInfoType[] | CartItem[]) {
    const newCartList = state.filter(
      (item) => !cartArr.map((obj) => obj.item_id).includes(item.item_id)
    );
    return sendReq(newCartList);
  }

  ////update
  function updateCart(item_id: number, quantity: number, checkout: boolean) {
    const newCartList = state.map((item) =>
      item.item_id === item_id
        ? { ...item, quantity: checkVal(quantity), checkout }
        : item
    );
    return sendReq(newCartList);
  }

  return {
    addToCart,
    deleteInCart,
    updateCart,
  };
}

export default useCartControl;
