import React from "react"
import { Link } from "react-router-dom"
import { pathInfo } from "../../helpers/config.js"
import * as Icon from "react-feather"

const MenuItem = () => {
  return (
    <>
      {pathInfo.map((item) => {
        const IconName = Icon[item.icon]
        return (
          <Link key={item.name} to={item.path}>
            <button className="menu-item">
              <IconName />
              <p className="lg:block md:hidden sm:block">{item.name}</p>
            </button>
          </Link>
        )
      })}
    </>
  )
}

export default MenuItem
