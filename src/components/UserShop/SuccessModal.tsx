import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type SuccessModalType = {
  showConfirmation: boolean;
  backToShop: () => void;
  successMessage: string;
  newLink: string;
};

function SuccessModal({
  showConfirmation,
  backToShop,
  successMessage,
  newLink,
}: SuccessModalType) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const confirmationModal = modalRef.current!;

  useEffect(() => {
    if (confirmationModal) {
      showConfirmation
        ? confirmationModal.showModal()
        : confirmationModal.close();
    }
  }, [showConfirmation, confirmationModal]);

  return (
    <dialog ref={modalRef} onCancel={backToShop}>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-md">
        <h1 className="text-2xl font-bold">Success!</h1>
        <p>{successMessage}</p>
        <div className="flex items-center justify-between gap-4">
          <button onClick={backToShop} className="secondary-button text-White">
            Back to shop
          </button>
          <Link
            to={newLink}
            onClick={backToShop}
            target="_blank"
            className="primary-button whitespace-nowrap font-bold"
          >
            View item page
          </Link>
        </div>
      </div>
    </dialog>
  );
}

export default SuccessModal;
