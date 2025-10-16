import { Link } from "react-router-dom"
import LogoSm from "./LogoSm"
import useNavLinks from "../hooks/useNavLinks"

export default function Footer() {
  const { links } = useNavLinks()

  return (
    <div className="font-main">
      <div className="flex items-center justify-center bg-Grayish-blue p-2 text-center text-Very-dark-blue">
        <LogoSm />
        <p className="text-xs">by</p>
        <Link className="text-md ml-1" target="_blank" to={"https://seandg.netlify.app/"}>
          Sean
        </Link>
      </div>
      <div className="flex flex-col justify-around bg-Very-dark-blue text-center text-White md:flex-row md:text-left">
        {links.map(({ linkHeader, links }, i) => (
          <div className="mx-auto hidden p-4 shadow-md md:flex md:flex-col md:gap-2" key={i}>
            <p className="text-sm font-bold">{linkHeader}</p>
            {links.map(({ name, to }, i) => (
              <Link to={to} className="text-sm" target="_blank" key={i}>
                {name}
              </Link>
            ))}
          </div>
        ))}
        <div className="h-4 bg-Very-dark-blue" />
      </div>
    </div>
  )
}
