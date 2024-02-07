import { ReactSVG } from "react-svg";
import { useAuthContext } from "../../context/AuthContext";
import { isAxiosError } from "axios";
import useRefreshPage from "../../hooks/useRefreshPage";

type SetDefaultAddressType = {
  address_id: number;
  isDefault: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function SetDefaultAddress({
  isDefault,
  address_id,
  setIsLoading,
}: SetDefaultAddressType) {
  const { privateReq, user_id } = useAuthContext();
  const { refreshPage } = useRefreshPage();

  async function handleClick() {
    setIsLoading(true);
    let success = false;
    try {
      await privateReq.patch("/address/default", {
        address_id,
        user_id,
      });
      success = true;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
      success && refreshPage();
    }
  }

  return (
    <>
      {isDefault ? (
        <p className="flex cursor-default gap-2 whitespace-nowrap bg-Green px-4 py-2 text-White">
          <span>{`✔`}</span>
          <span className="hidden md:block">{`Default`}</span>
        </p>
      ) : (
        <button
          onClick={handleClick}
          className="secondary-button flex items-center gap-2 text-White"
        >
          <ReactSVG src="/svg/icon-reply.svg" className="fill-current" />
          <p className="hidden md:block">Set</p>
        </button>
      )}
    </>
  );
}

export default SetDefaultAddress;
