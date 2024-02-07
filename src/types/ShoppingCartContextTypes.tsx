import { RatingType } from "../components/UserInfo/RatingForm";
import { ImgType } from "./ImgTypes";

export type CartItem = {
  item_id: number;
  quantity: number;
  checkout: boolean;
  option: AttributeType | null;
};

export type AttributeType = {
  attribute_id: number;
  attribute_name: string;
  attribute_value: string;
};

export type ItemBubbleInfoType = ImgType & {
  item_id: number;
  item_name: string;
  item_price: number;
  item_default_img_id: number;
  shop_id: number;
  shop_name: string;
  discount: number | null;
  start_date: string | null;
  end_date: string | null;
  average_score: number | null;
};

export type ItemInfoType = ItemBubbleInfoType & {
  item_desc: string;
  item_imgs: ImgType[];
  item_tags: string[];
  item_attributes: AttributeType[] | null;
  latest_reviews: RatingType[] | null;
  rating_tally: number[] | null;
};

export type CartItemInfoType = CartItem & ItemBubbleInfoType;

export type ShoppingCartContextType = {
  cartItem: CartItem[];
  setCartItem: React.Dispatch<React.SetStateAction<CartItem[]>>;
  anonItem: CartItem[];
  setAnonItem: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cart: CartItemInfoType[];
  setCart: React.Dispatch<React.SetStateAction<CartItemInfoType[]>>;
  selectedInCart: CartItemInfoType[];
  totalCost: number;
  cartLoading: boolean;
  setCartLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
