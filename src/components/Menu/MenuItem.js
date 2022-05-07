import React, { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { pathInfo } from "../../helpers/config.js"
import * as Icon from "react-feather"
import { array, string } from "prop-types"

const MenuItem = ({ type, content }) => {
  const { pathname } = useLocation()

  return (
    <div>
      {type === "layout" ? (
        <>
          {pathInfo.map((item) => {
            const IconName = Icon[item.icon]
            let isActive = false
            if (item.path === "/") {
              isActive = pathname === item.path
            } else {
              isActive = pathname.replace("/", "").includes(item.path)
            }
            return (
              <Link key={item.name} to={item.path}>
                <button
                  className={`menu-item__light ${
                    isActive ? "menu-item__light--active" : ""
                  }`}
                >
                  <IconName />
                  <p className="lg:block md:hidden sm:block">{item.name}</p>
                </button>
              </Link>
            )
          })}
        </>
      ) : (
        <>
          {content &&
            content.map((item) => (
              <Link to={item} key={item}>
                <button className="">{item}</button>
              </Link>
            ))}
        </>
      )}
    </div>
  )
}

MenuItem.propTypes = {
  type: string,
  content: array,
}

export default MenuItem
