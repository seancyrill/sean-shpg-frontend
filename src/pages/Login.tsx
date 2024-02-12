import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const {
    token,
    setToken,
    privateReq,
    authLoading,
    setAuthLoading,
    setFetchErrModal,
  } = useAuthContext();
  const [error, setError] = useState(null);

  const emptyInput = { username: "", password: "" };
  const [loginInput, setLoginInput] = useState(emptyInput);
  const disableLogin =
    loginInput.username.length > 0 && loginInput.password.length > 0
      ? false
      : true;

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  async function handleSubmit(input: typeof loginInput) {
    let success = false;
    setAuthLoading(true);
    try {
      const response = await privateReq.post("/auth", input);
      setToken(response.data.accessToken);
      setLoginInput(emptyInput);
      setError(null);
      success = true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.message);
        setError(error.response?.data.message);
      } else {
        console.error(error);
      }
      setFetchErrModal(true);
    } finally {
      if (success) {
        //setTimeout(() => {
        navigate(from, { replace: true });
        //}, 100);
      }
      setAuthLoading(false);
    }
  }

  //redirects if already logged in
  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token]);

  const usernameRef = useRef<HTMLInputElement>(null);
  //focus on usename input on load
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => (e.preventDefault(), handleSubmit(loginInput))}
        className="m-auto mt-4 flex min-h-[305px] w-[320px] flex-col justify-between gap-4 rounded-sm bg-White p-6 shadow-md"
      >
        <div className="flex flex-col gap-4 ">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <label className="off-screen">Username</label>
          <input
            required
            className="input-field"
            placeholder="Username"
            ref={usernameRef}
            type="text"
            value={loginInput.username}
            onChange={(e) =>
              setLoginInput({ ...loginInput, username: e.target.value })
            }
          />
          <label className="off-screen">Password</label>
          <input
            required
            className="input-field"
            placeholder="Password"
            type="password"
            value={loginInput.password}
            onChange={(e) =>
              setLoginInput({ ...loginInput, password: e.target.value })
            }
          />
          {error && (
            <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={disableLogin}
          className="primary-button font-bold disabled:blur-sm disabled:saturate-0"
        >
          Log in
        </button>
      </form>

      <div className="mt-4 flex min-w-[320px] flex-col gap-4 rounded-sm bg-White p-6 shadow-md">
        <Link
          to={"/registrar/register"}
          state={from}
          replace
          className="secondary-button text-center text-White"
        >
          Create new Account
        </Link>
      </div>

      <LoadingSpinner loading={authLoading} />
    </div>
  );
}
