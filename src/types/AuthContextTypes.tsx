import { AxiosInstance } from "axios";
import { ReactNode } from "react";
import { ImgType } from "./ImgTypes";

export type ProviderType = {
  children: ReactNode;
};

export type tokenStateType = null | string;

export type userInfoType = {
  user_id: number | null;
  username: string | null;
  user_default_address_id: number | null;
  shop_id: number | null;
  shop_name: string | null;
  user_default_img: ImgType | null;
  shop_default_img: ImgType | null;
};

export type AuthContextType = userInfoType & {
  authLoading: boolean;
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  token: tokenStateType;
  setToken: React.Dispatch<React.SetStateAction<tokenStateType>>;
  refreshAccessToken: () => Promise<any>;
  basicReq: AxiosInstance;
  privateReq: AxiosInstance;
  handleLogOut: () => void;
  userCartMounted: React.MutableRefObject<boolean>;
  fetchErrModal: boolean;
  setFetchErrModal: React.Dispatch<React.SetStateAction<boolean>>;
};
