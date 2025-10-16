import { createContext, useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import jwtDecode from "jwt-decode"
import {
  AuthContextType,
  ProviderType,
  tokenStateType,
  userInfoType,
} from "../types/AuthContextTypes"

const AuthContext = createContext({} as AuthContextType)

//hook to use
export function useAuthContext() {
  return useContext(AuthContext)
}

//context starts here
export function AuthProvider({ children }: ProviderType) {
  const [authLoading, setAuthLoading] = useState(true)
  const [token, setToken] = useState<tokenStateType>(null)
  const {
    user_id,
    username,
    user_default_address_id,
    shop_id,
    shop_name,
    shop_default_img,
    user_default_img,
  }: userInfoType = token ? jwtDecode(token) : ({} as userInfoType)

  const [fetchErrModal, setFetchErrModal] = useState(false)

  //higher context tree to use on logout
  const userCartMounted = useRef(false)

  const handleLogOut = async () => {
    setAuthLoading(true)
    try {
      await privateReq.post("/auth/logout")
      setToken(null)
      userCartMounted.current = false
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data)
      } else {
        console.error(error)
      }
      setFetchErrModal(true)
    } finally {
      setAuthLoading(false)
    }
  }

  const refreshAccessToken = async () => {
    setAuthLoading(true)
    try {
      const response = await privateReq.get("/auth/refresh")
      const newToken = response.data.accessToken
      setToken(newToken)
      return newToken
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.config?.signal?.aborted) return
        if (error.response?.data?.message === "Token expired") {
          return handleLogOut()
        }
        if (error.response?.data?.message === "No cookie found") {
          return
        }
        console.error(error.response?.data?.message)
      } else {
        console.error(error)
      }
      setFetchErrModal(true)
    } finally {
      setAuthLoading(false)
    }
  }

  //// request handlers ////
  const base_URL = import.meta.env.ENV_API_URL
  //for public req
  const basicReq = axios.create({
    baseURL: base_URL,
  })
  //for req with token
  const privateReq = axios.create({
    baseURL: base_URL,
    timeout: 5000,
    headers: {
      "Content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })

  //interceptors
  useEffect(() => {
    /* //attach token to req
    const requestIntercept = privateReq.interceptors.request.use(
      (config) => {
        config.headers["authorization"] = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    ); */

    //refresh token upon access token exp
    const responseIntercept = privateReq.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (
          error?.response?.status === 403 &&
          prevRequest?.sent !== undefined &&
          !prevRequest.sent
        ) {
          prevRequest.sent = true //breaks the loop
          const newToken = await refreshAccessToken()
          //retry request after refreshing token
          prevRequest.headers["authorization"] = `Bearer ${newToken}`
          return privateReq(prevRequest)
        }
        return Promise.reject(error)
      }
    )
    //cleanup
    return () => {
      //privateReq.interceptors.request.eject(requestIntercept);
      privateReq.interceptors.response.eject(responseIntercept)
    }
  }, [token, refreshAccessToken])

  return (
    <AuthContext.Provider
      value={{
        authLoading,
        setAuthLoading,
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
  )
}
export default AuthContext
