import { createContext, useContext, useEffect, useState } from "react";
import { ProviderType } from "../types/AuthContextTypes";
import {
  ShoppingCartContextType,
  CartItem,
  CartItemInfoType,
  ItemBubbleInfoType,
} from "../types/ShoppingCartContextTypes";
import { isAxiosError } from "axios";
import { useAuthContext } from "./AuthContext";
import { discountedPrice } from "../utilities/discountedPrice";

const ShoppingCartContext = createContext({} as ShoppingCartContextType);

//hook to use context
export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

//cart global settings
export const MAX_QTY = 10;
export const MIN_QTY = 1;

//////////// context start /////////////////////
export function ShoppingCartProvider({ children }: ProviderType) {
  const {
    token,
    user_id,
    userCartMounted,
    basicReq,
    privateReq,
    refreshAccessToken,
  } = useAuthContext();

  const [anonItem, setAnonItem] = useState([] as CartItem[]);
  const [cartItem, setCartItem] = useState([] as CartItem[]);
  const [cart, setCart] = useState([] as CartItemInfoType[]);

  const selectedInCart = cart.filter((item) => item.checkout) || [];
  const totalCost = selectedInCart.reduce(
    (accumulator, { item_price, discount, quantity }) => {
      return discountedPrice(item_price, discount) * quantity + accumulator;
    },
    0
  );

  const [cartLoading, setCartLoading] = useState(true);

  //// init setup ////
  useEffect(() => {
    const localCart = localStorage.getItem("anontItems");
    if (localCart) {
      setAnonItem(JSON.parse(localCart));
    }
    setCartLoading(false);
  }, []);

  //// set cart state on log in ////
  useEffect(() => {
    const controller = new AbortController();

    const setUserCartInit = async () => {
      setCartLoading(true);
      try {
        const response = await privateReq.get(`/users/cart`, {
          signal: controller.signal,
          params: {
            user_id,
          },
        });
        if (response.data !== null) {
          setCartItem(response.data);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.config?.signal?.aborted) return; //abort controller
          console.error(error.response?.data);
        } else {
          console.error(error);
        }
      } finally {
        setCartLoading(false);
        userCartMounted.current = true;
      }
    };

    if (token) {
      setUserCartInit();
    } else {
      setCartItem([]);
    }
    return () => {
      controller.abort();
    };
  }, [token]);

  //// setting anon items to user when logged in ////
  useEffect(() => {
    const controller = new AbortController();

    async function setAnonToUser() {
      setCartLoading(true);

      //makes new array of items combining cart and anon items
      let newCartList = [...cartItem];
      anonItem.map((itemObj) => {
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

      //add to db and remove anonitems from local
      try {
        const response = await privateReq.patch(
          "/users/cart",
          {
            user_id,
            cartArray: newCartList,
          },
          { signal: controller.signal }
        );
        setCartItem(response.data?.user_cart);
        setAnonItem([]);
        localStorage.setItem("anontItems", JSON.stringify([]));
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.config?.signal?.aborted) return;
          console.error(error.response?.data);
        } else {
          console.error(error);
        }
      } finally {
        setCartLoading(false);
      }
    }

    if (token && userCartMounted.current && anonItem.length) {
      setAnonToUser();
    }

    return () => {
      controller.abort();
    };
  }, [userCartMounted.current]);

  //// item on cart data handler ////
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCartItemInfo() {
      setCartLoading(true);
      try {
        const cart_id_list = cartItem.map((item) => item.item_id);
        const anon_id_list = anonItem.map((item) => item.item_id);
        //makes a string of id(s) for api request (eg. "1, 2, 3") with no repeats
        const id_list = [...new Set([...cart_id_list, ...anon_id_list])];
        const response = await basicReq.get(`/items/cart`, {
          signal: controller.signal,
          params: {
            id_list,
          },
        });
        const items_info: ItemBubbleInfoType[] = response.data;
        const list = userCartMounted.current ? cartItem : anonItem;

        //filters out ids of items not being sold anymore
        const obsoleteIds = id_list.filter(
          (id) => !items_info.some((found) => found.item_id === +id)
        );
        if (obsoleteIds.length) {
          const existingItems = list.filter(
            (item) => !obsoleteIds.includes(item.item_id)
          );
          if (token) {
            const removeFromUser = await privateReq.patch(
              "/users/cart",
              {
                user_id,
                cartArray: existingItems,
              },
              { signal: controller.signal }
            );
            setCartItem(removeFromUser.data);
          } else {
            localStorage.setItem("anontItems", JSON.stringify(existingItems));
            setAnonItem(existingItems);
          }
          return refreshAccessToken(); //stops useeffect data handler here and start from fetching again
        }

        //proceeds to setting data
        const combineData = list.map((item) => {
          const data = items_info.find(
            (data) => data.item_id === item.item_id
          )!;
          return {
            ...data,
            ...item,
          };
        });
        setCart(combineData);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.config?.signal?.aborted) return;
          console.error(error.response?.data);
        } else {
          console.error(error);
        }
      } finally {
        setCartLoading(false);
      }
    }

    if (cartItem.length || anonItem.length) {
      fetchCartItemInfo();
    } else {
      setCart([]);
    }

    return () => {
      controller.abort();
    };
  }, [cartItem, anonItem]);

  return (
    <ShoppingCartContext.Provider
      value={{
        cartItem,
        setCartItem,
        anonItem,
        setAnonItem,
        cart,
        setCart,
        selectedInCart,
        totalCost,
        cartLoading,
        setCartLoading,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
export default ShoppingCartContext;
