import React from "react"
import { Link } from "react-router-dom"
import { pathInfo } from "../../helpers/config.js"
import * as Icon from "react-feather"
import { array, string } from "prop-types"

const MenuItem = ({ type, content }) => {
  return (
    <>
      {type === "layout" ? (
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
    </>
  )
}

MenuItem.propTypes = {
  type: string,
  content: array,
}

export default MenuItem
