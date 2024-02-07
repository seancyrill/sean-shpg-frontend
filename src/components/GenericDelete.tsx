import { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";

export type modalContentType = {
  head: string;
  body: string;
  confirm: string;
  cancel: string;
};

type GenericDeleteType = {
  handleDelete: (() => Promise<void>) | (() => void);
  modalContent: modalContentType;
  buttonText?: string;
  full?: boolean;
  disable?: boolean;
};

function GenericDelete({
  full,
  handleDelete,
  modalContent,
  buttonText,
  disable,
}: GenericDeleteType) {
  const deleteModal = useRef<HTMLDialogElement>(null);
  const deleteConfirm = deleteModal.current!;
  const [openModal, setOpenModal] = useState(false);

  const { body, cancel, confirm, head } = modalContent;

  useEffect(() => {
    if (deleteConfirm) {
      openModal ? deleteConfirm.showModal() : deleteConfirm.close();
    }
  }, [openModal, deleteConfirm]);

  function handleBtn() {
    setOpenModal(true);
  }

  function handleCancel() {
    setOpenModal(false);
  }
  async function handleConfirm() {
    await handleDelete();
    setOpenModal(false);
  }

  return (
    <div>
      <button
        onClick={(e) => (e.preventDefault(), handleBtn())}
        className="secondary-button flex w-full items-center justify-center gap-2 text-Soft-Red hover:scale-110 hover:text-Red disabled:blur-sm disabled:saturate-0"
        disabled={disable}
      >
        <ReactSVG src="/svg/icon-delete.svg" className="fill-current" />
        {full && (
          <label className="hidden md:block">{buttonText || "Delete"}</label>
        )}
      </button>

      <dialog
        ref={deleteModal}
        className="p-4"
        onCancel={() => setOpenModal(false)}
      >
        <p className="text-left text-xl font-bold">{head}</p>
        <p className="my-4 text-left">{body}</p>
        <div className="flex items-end justify-end gap-4">
          <button
            className="smooth-animation border-[1px] px-4 py-1 hover:scale-105 hover:opacity-90"
            onClick={(e) => (e.preventDefault(), handleCancel())}
          >
            {cancel}
          </button>
          <button
            className="smooth-animation border-[1px] bg-Red px-4 py-1 text-White hover:scale-105 hover:opacity-90"
            onClick={(e) => (e.preventDefault(), handleConfirm())}
          >
            {confirm}
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default GenericDelete;
