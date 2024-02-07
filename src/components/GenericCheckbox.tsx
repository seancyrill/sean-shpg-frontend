type GenericCheckboxType = {
  onClick: () => void;
  checked: boolean;
  label: string;
  disabled?: boolean;
};

function GenericCheckbox({
  checked,
  label,
  onClick,
  disabled,
}: GenericCheckboxType) {
  return (
    <button
      onClick={(e) => (e.preventDefault(), onClick())}
      className="flex w-full cursor-pointer items-center gap-2 p-4 hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
    >
      <div
        className={`smooth-animation grid h-4 w-4 place-content-center items-center gap-2 ${
          checked ? "bg-Orange text-White" : "border border-Very-dark-blue"
        }`}
      >
        {checked && <p className="text-sm">✔</p>}
      </div>
      <label className={`${disabled && "cursor-not-allowed"}`}>{label}</label>
    </button>
  );
}

export default GenericCheckbox;
