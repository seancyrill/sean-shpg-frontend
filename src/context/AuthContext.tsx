import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {
  AuthContextType,
  ProviderType,
  tokenStateType,
  userInfoType,
} from "../types/AuthContextTypes";

const AuthContext = createContext({} as AuthContextType);

//hook to use
export function useAuthContext() {
  return useContext(AuthContext);
}

//context starts here
export function AuthProvider({ children }: ProviderType) {
  const [token, setToken] = useState<tokenStateType>(null);
  const {
    user_id,
    username,
    user_default_address_id,
    shop_id,
    shop_name,
    shop_default_img,
    user_default_img,
  }: userInfoType = token ? jwtDecode(token) : ({} as userInfoType);

  const [fetchErrModal, setFetchErrModal] = useState(false);

  //higher context tree to use on logout
  const userCartMounted = useRef(false);
  const handleLogOut = async () => {
    try {
      await privateReq.post("/auth/logout");
      setToken(null);
      userCartMounted.current = false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await privateReq.get("/auth/refresh");
      const newToken = response.data.accessToken;
      setToken(newToken);
      return newToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message === "Token expired") {
          handleLogOut();
        }
        console.error(error.response?.data?.message);
      } else {
        console.error(error);
      }
    }
  };

  //// request handlers ////
  const base_URL = "http://localhost:3500/";
  //for public req
  const basicReq = axios.create({
    baseURL: base_URL,
  });
  //for req with token
  const privateReq = axios.create({
    baseURL: base_URL,
    timeout: 1000,
    headers: {
      "Content-type": "application/json",
    },
    withCredentials: true,
  });

  //interceptors
  useEffect(() => {
    //attach token to req
    const requestIntercept = privateReq.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    //refresh token upon access token exp
    const responseIntercept = privateReq.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true; //breaks the loop
          const newToken = await refreshAccessToken();
          //retry request after refreshing token
          prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return privateReq(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    //cleanup
    return () => {
      privateReq.interceptors.request.eject(requestIntercept);
      privateReq.interceptors.response.eject(responseIntercept);
    };
  }, [token, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user_id,
        username,
        user_default_img,
        user_default_address_id,
        shop_id,
        shop_name,
        shop_default_img,
        refreshAccessToken,
        basicReq,
        privateReq,
        handleLogOut,
        userCartMounted,
        fetchErrModal,
        setFetchErrModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthContext;
