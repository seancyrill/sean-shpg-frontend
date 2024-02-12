import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuthContext } from "../context/AuthContext";
import Profile from "./UserControls/UserInfo/Profile";
import LoadingSpinner from "../components/LoadingSpinner";
import { ReactSVG } from "react-svg";

const emptyInput = { username: "", password: "", confirmPw: "" };
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
export const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function signUp() {
  const { setToken, basicReq, privateReq } = useAuthContext();

  const [newId, setNewId] = useState<number | null>(null);
  const [error, setError] = useState(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const [signUpInput, setSignUpInput] = useState(emptyInput);
  const [usernameInputError, setUsernameInputError] = useState<string | null>(
    null
  );
  const [passwordInputError, setPasswordInputError] = useState<string | null>(
    null
  );
  const [confirmpwInputError, setConfirmpwInputError] = useState<string | null>(
    null
  );

  const [showCPw, setShowCPw] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const disableSubmit = //disables submit button if theres any errors in inputs AND any input field is empty
    [usernameInputError, passwordInputError, confirmpwInputError].some(
      (error) => error !== null
    ) || !Object.values(signUpInput).every((input) => input.length > 0);

  const [usernameFocus, setUsernameFocus] = useState(false);

  const location = useLocation();
  const from = location.state || "/";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    try {
      const register = await basicReq.post("/users", signUpInput);
      setNewId(register.data);
      setLoading(true);
      if (register.status === 201) {
        const login = await privateReq.post("/auth/", signUpInput);
        setToken(login.data.accessToken);
        setSignUpInput(emptyInput);
        setError(null);
        setSuccess(true);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.message);
        setError(error.response?.data.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  //focus on usename input on load
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  //username format checker
  useEffect(() => {
    const testInput = USER_REGEX.test(signUpInput.username);
    const usernameErr = "Invalid username format";
    if (testInput) {
      setUsernameInputError(null);
    } else {
      setPasswordInputError(usernameErr);
    }
  }, [signUpInput.username]);

  //password format checker
  useEffect(() => {
    const testInput = PWD_REGEX.test(signUpInput.password);
    const passwordErr = "Invalid password format";

    if (testInput) {
      setPasswordInputError(null);
    } else {
      setPasswordInputError(passwordErr);
    }
  }, [signUpInput.password]);

  //confirm password
  useEffect(() => {
    const testInput = signUpInput.password === signUpInput.confirmPw;
    const confirmPwErr = "Passwords did not match";
    if (testInput) {
      setConfirmpwInputError(null);
    } else {
      setConfirmpwInputError(confirmPwErr);
    }
  }, [signUpInput.confirmPw, signUpInput.password]);

  return (
    <>
      {!success ? (
        <div>
          <form
            onSubmit={(e) => (e.preventDefault(), handleSubmit())}
            className="smooth-animation m-auto mt-4 flex min-h-[480px] w-[320px] flex-col justify-between gap-4 rounded-sm bg-White p-6 shadow-md"
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Create a new Account</h1>

              <label className="off-screen">Username</label>
              <input
                required
                className="input-field"
                placeholder="Username"
                type="text"
                ref={usernameRef}
                value={signUpInput.username}
                onChange={(e) =>
                  setSignUpInput({ ...signUpInput, username: e.target.value })
                }
                onFocus={() => setUsernameFocus(true)}
                onBlur={() => setUsernameFocus(false)}
              />
              {usernameInputError &&
                usernameFocus &&
                signUpInput.username.length > 0 && (
                  <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
                    {usernameInputError}
                  </p>
                )}
              {usernameFocus && (
                <ul className="list-disc px-4">
                  <li>4 to 24 characters.</li>
                  <li>Must begin with a letter.</li>
                  <li>Letters, numbers, underscores, hyphens allowed.</li>
                </ul>
              )}
              <label className="off-screen">Password</label>
              <div className="input-field flex items-center gap-1 pr-1">
                <input
                  required
                  className="h-full w-full border-none"
                  placeholder="Password"
                  type={showPw ? "text" : "password"}
                  value={signUpInput.password}
                  onChange={(e) =>
                    setSignUpInput({ ...signUpInput, password: e.target.value })
                  }
                  //onFocus={() => setPasswordFocus(true)}
                  //onBlur={() => setPasswordFocus(false)}
                />
                <ReactSVG
                  src={`/svg/icon-show-${showPw ? "off" : "on"}.svg`}
                  className="smooth-animation cursor-pointer fill-Grayish-blue p-1 hover:fill-Orange"
                  onClick={() => setShowPw((prev) => !prev)}
                />
              </div>
              {passwordInputError && signUpInput.password.length > 0 && (
                <>
                  <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
                    {passwordInputError}
                  </p>
                  <div className="px-4">
                    <h6 className="font-bold">Requires:</h6>
                    <ul className="list-disc">
                      <li>Minimum eight characters</li>
                      <li>Uppercase letter</li>
                      <li>Lowercase letter</li>
                      <li>Number</li>
                      <li>Special character</li>
                    </ul>
                  </div>
                </>
              )}

              <label className="off-screen">Re-enter password</label>
              <div className="input-field flex items-center gap-1 pr-1">
                <input
                  required
                  className="h-full w-full"
                  placeholder="Confirm Password"
                  type={showCPw ? "text" : "password"}
                  value={signUpInput.confirmPw}
                  onChange={(e) =>
                    setSignUpInput({
                      ...signUpInput,
                      confirmPw: e.target.value,
                    })
                  }
                />
                <ReactSVG
                  src={`/svg/icon-show-${showCPw ? "off" : "on"}.svg`}
                  className="smooth-animation cursor-pointer fill-Grayish-blue p-1 hover:fill-Orange"
                  onClick={() => setShowCPw((prev) => !prev)}
                />
              </div>
              {confirmpwInputError && signUpInput.confirmPw.length > 0 && (
                <>
                  <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
                    {confirmpwInputError}
                  </p>
                  <ul className="list-disc px-4">
                    <li>Must match the first password input field.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {error && (
                <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="primary-button font-bold disabled:blur-sm disabled:saturate-0"
                disabled={disableSubmit}
              >
                Sign up
              </button>
            </div>
            <LoadingSpinner loading={loading} />
          </form>

          <div className="m-auto mt-4 flex min-w-[320px] flex-col gap-4 rounded-sm bg-White p-6 shadow-md">
            <Link
              to={"/registrar/login"}
              state={from}
              replace
              className="secondary-button text-center text-White"
            >
              Already have an account?{" "}
              <span className="font-bold text-Orange">Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex h-fit flex-col items-center gap-4">
          <div className="mt-8 flex h-fit w-[320px] flex-1 flex-col border bg-White p-4">
            <h1 className="mb-2  text-sm font-bold">Customize your avatar:</h1>
            <Profile newId={newId || undefined} />
          </div>
          <div className="flex w-[320px] flex-col gap-1 rounded-sm bg-White p-6 shadow-md">
            <Link
              to={from}
              replace
              className="secondary-button text-center text-White"
            >
              Skip this
            </Link>
            <p className="text-center text-xs text-Grayish-blue">
              You can always come back to customize your profile.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
