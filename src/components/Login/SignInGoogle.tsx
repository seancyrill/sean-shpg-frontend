import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { ReactSVG } from "react-svg";
import { useAuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

function SignInGoogle() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  const { setAuthLoading, privateReq, setToken, setFetchErrModal } =
    useAuthContext();

  async function handleGoogleSignIn(params: any) {
    let success = false;
    setAuthLoading(true);
    try {
      const response = await privateReq.post("/auth/google", params);
      setToken(response.data.accessToken);
      success = true;
    } catch (error) {
      console.log(error);
      setFetchErrModal(true);
    } finally {
      setAuthLoading(true);
      if (success) {
        navigate(from, { replace: true });
      }
    }
  }

  const handleClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "application/json",
          },
        }
      );

      const { email, picture } = response.data;
      await handleGoogleSignIn({ username: email, img: picture });
    },
    onError: (error) => {
      console.error(error);
      setFetchErrModal(true);
    },
  });

  return (
    <button
      onClick={() => handleClick()}
      className="secondary-button flex items-center border bg-transparent
        text-center font-bold"
    >
      <ReactSVG src="/svg/icon-google.svg" />
      <p className="w-full">Google</p>
    </button>
  );
}

export default SignInGoogle;
