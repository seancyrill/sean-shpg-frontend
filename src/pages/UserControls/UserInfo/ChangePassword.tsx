import { useEffect, useRef, useState } from "react";
import { PWD_REGEX } from "../../Signup";
import { useAuthContext } from "../../../context/AuthContext";
import { isAxiosError } from "axios";
import { ReactSVG } from "react-svg";

type inputErrorsType = {
  newPwErr: string | null;
  confirmPwErr: string | null;
};

const emptyInput = {
  currentPw: "",
  newPw: "",
  confirmNewPw: "",
};

function ChangePassword() {
  const { user_id, privateReq } = useAuthContext();

  const currentPwRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(emptyInput);

  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [showNPw, setShowNPw] = useState(false);

  const [isSuccess, setIsSuccess] = useState({ state: null });
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState({} as inputErrorsType);

  async function handleSubmit() {
    const submitInput = {
      user_id,
      password: input.currentPw,
      newPassword: input.newPw,
    };
    try {
      console.log(submitInput);
      const response = await privateReq.patch("/users/password", submitInput, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(response);
      setIsSuccess({ state: response.data });
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.message);
        setError(error.response?.data.message);
      } else {
        console.error(error);
      }
    }
  }

  //focus on input field on load
  useEffect(() => {
    currentPwRef.current?.focus();
  }, []);

  //password format checker
  //password regex imported from SignUp page
  useEffect(() => {
    const testInput = PWD_REGEX.test(input.newPw);
    const newPwErr = "Invalid password format";
    testInput
      ? setInputErrors({ ...inputErrors, newPwErr: null })
      : setInputErrors({ ...inputErrors, newPwErr });
  }, [input.newPw]);

  //confirm password
  useEffect(() => {
    const testInput = input.newPw === input.confirmNewPw;
    const confirmPwErr = "Passwords did not match";
    testInput
      ? setInputErrors({ ...inputErrors, confirmPwErr: null })
      : setInputErrors({ ...inputErrors, confirmPwErr });
  }, [input.confirmNewPw]);

  const disableSubmit =
    !inputErrors.confirmPwErr && !inputErrors.newPwErr ? false : true;

  return (
    <div className="grid h-full items-start justify-center bg-Light-grayish-blue p-4">
      {isSuccess.state ? (
        //displays success message
        <p className="secondary-button rounded-lg p-4 px-8 text-xl uppercase text-Orange shadow-lg">
          {isSuccess.state}
        </p>
      ) : (
        <form
          onSubmit={(e) => (e.preventDefault(), handleSubmit())}
          className="flex min-w-[320px] flex-col gap-4 rounded-md bg-White p-6 shadow-md"
        >
          {error && (
            <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
              {error}
            </p>
          )}
          <div className="input-field flex items-center gap-4">
            <label className="off-screen">Current password</label>
            <input
              placeholder="Current Password"
              className="w-full border-none focus:outline-none"
              ref={currentPwRef}
              type={showPw ? "text" : "password"}
              value={input.currentPw}
              onChange={(e) =>
                setInput({ ...input, currentPw: e.target.value })
              }
            />
            <ReactSVG
              src={`/svg/icon-show-${showPw ? "off" : "on"}.svg`}
              className="smooth-animation cursor-pointer fill-Grayish-blue p-1 hover:fill-Orange"
              onClick={() => setShowPw((prev) => !prev)}
            />
          </div>

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

          <div className="flex flex-col gap-2">
            <label className="off-screen">New password</label>
            <div className="input-field flex items-center gap-4">
              <input
                placeholder="Enter New Password"
                className="w-full border-none focus:outline-none"
                type={showNPw ? "text" : "password"}
                value={input.newPw}
                onChange={(e) => setInput({ ...input, newPw: e.target.value })}
              />
              <ReactSVG
                src={`/svg/icon-show-${showNPw ? "off" : "on"}.svg`}
                className="smooth-animation cursor-pointer fill-Grayish-blue p-1 hover:fill-Orange"
                onClick={() => setShowNPw((prev) => !prev)}
              />
            </div>
            {inputErrors.newPwErr && input.newPw.length > 0 && (
              <p className="border border-Soft-Red px-2 py-1 text-Soft-Red">
                {inputErrors.newPwErr}
              </p>
            )}
          </div>

          <div className="flex flex-col  gap-2">
            <label className="off-screen">Re-type new password</label>
            <div className="input-field flex items-center gap-4">
              <input
                placeholder="Cofirm New Password"
                className="w-full border-none focus:outline-none"
                type={showCPw ? "text" : "password"}
                value={input.confirmNewPw}
                onChange={(e) =>
                  setInput({ ...input, confirmNewPw: e.target.value })
                }
              />
              <ReactSVG
                src={`/svg/icon-show-${showCPw ? "off" : "on"}.svg`}
                className="smooth-animation cursor-pointer fill-Grayish-blue p-1 hover:fill-Orange"
                onClick={() => setShowCPw((prev) => !prev)}
              />
            </div>
            {inputErrors.confirmPwErr && input.confirmNewPw.length > 0 && (
              <p className="border border-Soft-Red px-2 py-1 text-Soft-Red">
                {inputErrors.confirmPwErr}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={disableSubmit}
            className="primary-button font-bold disabled:blur-sm disabled:saturate-0"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default ChangePassword;
