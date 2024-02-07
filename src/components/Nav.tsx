import AccountNav from "./Nav/AccountNav";
import Logo from "./Logo";
import { ReactSVG } from "react-svg";
import { useState } from "react";
import SideBar from "./Nav/SideBar";
import LogoSm from "./LogoSm";

export default function Nav() {
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <nav className="sticky top-0 z-[999] flex items-center justify-between bg-Black p-1 text-White">
      <ul className="flex items-center">
        <li>
          <ReactSVG
            src="/svg/icon-menu.svg"
            className="smooth-animation cursor-pointer fill-White px-2 hover:fill-Orange"
            onClick={() => setOpenSideBar(true)}
          />
        </li>
        <li className="smooth-animation hidden place-content-center py-1 text-3xl hover:text-Orange md:grid">
          <Logo />
        </li>
        <li className="smooth-animation grid place-content-center py-1 text-3xl hover:text-Orange md:hidden">
          <LogoSm />
        </li>
      </ul>

      <AccountNav />

      <SideBar isOpen={openSideBar} onClose={() => setOpenSideBar(false)} />
    </nav>
  );
}
