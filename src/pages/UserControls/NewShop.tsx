import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import PostSetupShop from "../../components/UserShop/PostSetupShop";

type inputErrorsType = {
  nameErr: string | null;
  emailErr: string | null;
};

const emptyInput = { shop_name: "", shop_email: "" };
export const NAME_REGEX =
  /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~?!]{2,30}$/;
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function NewShop() {
  const { user_id, shop_id, privateReq } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [newShopInput, setNewShopInput] = useState(emptyInput);
  const [inputErrors, setInputErrors] = useState({} as inputErrorsType);
  const disableSubmit = //disables submit button if theres any errors in inputs AND any input field is empty
    !Object.values(inputErrors).every((err) => err === null) ||
    !Object.values(newShopInput).every((input) => input.length > 0);

  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newShopId, setNewShopId] = useState<number | null>(null);

  //redirect to edit shop if shop already exists
  useEffect(() => {
    !shop_id ? shop_id : navigate("/controls/shop");
  }, [shop_id]);

  async function handleSubmit() {
    setLoading(true);
    try {
      const newShopQuery = await privateReq.post("/shops", {
        ...newShopInput,
        user_id,
      });
      console.log(newShopQuery);
      const newId = newShopQuery.data;
      setError(null);
      setNewShopId(newId);
      console.log(newId);
      setSuccess(true);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
        setError(error.response?.data?.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  //focus on usename input on load
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  //name format checker
  useEffect(() => {
    const testInput = NAME_REGEX.test(newShopInput.shop_name);
    const nameErr = "Invalid name format";
    testInput
      ? setInputErrors({ ...inputErrors, nameErr: null })
      : setInputErrors({ ...inputErrors, nameErr });
  }, [newShopInput.shop_name]);

  //shop_email format checker
  useEffect(() => {
    const testInput = EMAIL_REGEX.test(newShopInput.shop_email);
    const emailErr = "Invalid shop_email format";
    testInput
      ? setInputErrors({ ...inputErrors, emailErr: null })
      : setInputErrors({ ...inputErrors, emailErr });
  }, [newShopInput.shop_email]);

  return (
    <>
      <h1 className="border-b p-8 text-3xl font-bold">Set up Shop</h1>
      <div className="grid flex-1 items-start justify-center bg-Light-grayish-blue">
        {!success ? (
          <form
            onSubmit={(e) => (e.preventDefault(), handleSubmit())}
            className="m-auto my-4 flex min-h-[250px] w-[320px] max-w-[320px] flex-col justify-between gap-4 rounded-md bg-White p-4 shadow-md"
          >
            <div className="flex flex-col gap-4">
              <label className="off-screen">Name</label>
              <input
                className="input-field"
                placeholder="Shop Name"
                type="text"
                ref={nameRef}
                value={newShopInput.shop_name}
                onChange={(e) =>
                  setNewShopInput({
                    ...newShopInput,
                    shop_name: e.target.value,
                  })
                }
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
              />
              {inputErrors.nameErr &&
                nameFocus &&
                newShopInput.shop_name.length > 0 && (
                  <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
                    {inputErrors.nameErr}
                  </p>
                )}
              {nameFocus && (
                <ul className="list-disc pl-4">
                  <li>Maximum of 30 characters only</li>
                </ul>
              )}
              <label className="off-screen">shop_email</label>
              <input
                className="input-field"
                placeholder="Shop Email"
                type="email"
                value={newShopInput.shop_email}
                onChange={(e) =>
                  setNewShopInput({
                    ...newShopInput,
                    shop_email: e.target.value,
                  })
                }
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              {inputErrors.emailErr &&
                emailFocus &&
                newShopInput.shop_email.length > 0 && (
                  <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
                    {inputErrors.emailErr}
                  </p>
                )}
              {emailFocus && (
                <ul className="list-disc pl-4">
                  <li>Enter a valid email address</li>
                </ul>
              )}
            </div>

            {error && (
              <p className="border border-Soft-Red px-4 py-2 text-Soft-Red">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="primary-button disabled:blur disabled:saturate-0"
              disabled={disableSubmit}
            >
              Submit
            </button>
          </form>
        ) : (
          <PostSetupShop
            newShopInput={newShopInput}
            setLoading={setLoading}
            setNewShopInput={setNewShopInput}
            newShopId={newShopId}
          />
        )}
        <LoadingSpinner loading={loading} />
      </div>
    </>
  );
}

export default NewShop;
