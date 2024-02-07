import logo from "/images/icon-logo.png";

type LoadingSpinnerInlineType = {
  loading: boolean;
};

function LoadingSpinnerInline({ loading }: LoadingSpinnerInlineType) {
  return (
    <div
      className={`m-auto h-full place-content-center ${
        loading ? "grid" : "hidden"
      }`}
    >
      <img
        src={logo}
        alt="logo"
        className={`h-24 w-24 animate-loading-spinner`}
      />
    </div>
  );
}

export default LoadingSpinnerInline;
