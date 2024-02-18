import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import useNavLinks from "../../hooks/useNavLinks";

type SideBarType = {
  isOpen: boolean;
  onClose: () => void;
};

function SideBar({ isOpen, onClose }: SideBarType) {
  const { links } = useNavLinks();
  return (
    <div
      onClick={onClose}
      className={`smooth-animation fixed inset-0 z-50 overflow-scroll bg-Very-dark-blue bg-opacity-75 ${
        isOpen ? "translate-x-0" : "-translate-x-[100vw]"
      }`}
    >
      <div
        className={`smooth-animation absolute left-0 top-0 h-full w-64 gap-8 bg-White shadow ${
          isOpen ? "translate-x-0" : "-translate-x-[100vw]"
        }`}
      >
        <ReactSVG
          src="/svg/icon-close.svg"
          onClick={onClose}
          className="flex cursor-pointer flex-row-reverse bg-White fill-Soft-Red p-4 shadow-md"
        />
        {links.map(({ linkHeader, links }, i) => (
          <div className="flex flex-col border-y bg-White shadow-md" key={i}>
            <p className="cursor-default px-4 py-2 text-xl font-bold text-Black">
              {linkHeader}
            </p>
            {links.map(({ name, to }, i) => (
              <Link
                to={to}
                className="px-4 py-2 text-lg text-Very-dark-blue hover:bg-Orange hover:text-White"
                key={i}
              >
                {name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
