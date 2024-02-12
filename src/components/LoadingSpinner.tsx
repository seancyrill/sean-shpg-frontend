import { useEffect, useRef } from "react";
import logo from "/images/icon-logo.png";

type LoadingSpinnerType = {
  loading: boolean;
};

function LoadingSpinner({ loading }: LoadingSpinnerType) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const loadingModal = modalRef.current!;

  useEffect(() => {
    if (loadingModal) {
      loading ? loadingModal.showModal() : loadingModal.close();
    }
  }, [loading, loadingModal]);

  return (
    <>
      {
        <dialog
          className="h-[320px] w-[320px] place-content-center rounded-full p-8 backdrop:bg-Very-dark-blue"
          ref={modalRef}
        >
          <div className="grid h-full place-content-center">
            <div
              className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-Very-dark-blue blur-md`}
            />
            <img
              src={logo}
              alt="logo"
              className={`h-24 w-24 animate-loading-spinner`}
            />
          </div>
        </dialog>
      }
    </>
  );
}

export default LoadingSpinner;
