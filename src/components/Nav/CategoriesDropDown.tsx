import { useState } from "react";
import { ReactSVG } from "react-svg";
import useNavLinks from "../../hooks/useNavLinks";
import { Link } from "react-router-dom";

function CategoriesDropDown() {
  const [showDropDown, setShowDropDown] = useState(false);
  const { links } = useNavLinks();
  const categories = links.find(
    ({ linkHeader }) => linkHeader === "Categories"
  )?.links;

  function handleToggle() {
    setShowDropDown((prev) => !prev);
  }

  return (
    <>
      <div
        className="smooth-animation relative hidden cursor-pointer gap-2 p-4 text-xs text-White hover:text-Orange sm:flex"
        onMouseEnter={() => setShowDropDown(true)}
        onMouseLeave={() => {
          setShowDropDown(false);
        }}
        onClick={handleToggle}
      >
        <h4>CATEGORIES</h4>
        <ReactSVG
          src="/svg/icon-next.svg"
          className="rotate-90 fill-current stroke-current"
        />

        {categories && (
          <aside
            className={`smooth-animation absolute bottom-0 left-0 z-40 flex origin-top-right translate-y-full flex-col border bg-White text-base text-Black ${
              !showDropDown && "scale-0"
            }`}
          >
            {categories.map(({ name, to }, i) => (
              <Link
                key={`category${i}`}
                to={to}
                className="px-4 py-2 hover:bg-Orange hover:text-White "
              >
                {name}
              </Link>
            ))}
          </aside>
        )}
      </div>
    </>
  );
}

export default CategoriesDropDown;
