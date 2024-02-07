import { useEffect, useRef } from "react";

type fetchErrorType = {
  fetchErrModal: boolean;
  setFetchErrModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function fetchError({ fetchErrModal, setFetchErrModal }: fetchErrorType) {
  const errModal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = errModal.current;
    if (modal) {
      fetchErrModal ? modal.showModal() : modal.close();
    }
  }, [fetchErrModal, errModal]);

  function handleClose() {
    setFetchErrModal(false);
  }

  return (
    <dialog
      ref={errModal}
      className="p-4 text-lg"
      onClick={handleClose}
      onCancel={() => setFetchErrModal(false)}
    >
      <div className="flex justify-between">
        <h1 className="font-bold">Oops!</h1>
        <input
          type="image"
          src="/svg/icon-close.svg"
          alt="closeModal"
          className="h-4"
        />
      </div>
      <p>Something went wrong. Please try again.</p>
    </dialog>
  );
}

export default fetchError;
