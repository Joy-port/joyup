import React from "react"
import { Link } from "react-router-dom"
import { pathInfo } from "../../helpers/config.js"

const MenuItem = () => {
  return (
    <>
      {pathInfo.map((item) => (
        <Link key={item.name} to={item.path}>
          {/* <div className="">{icon}</div> */}
          <div className="">{item.name}</div>
        </Link>
      ))}
    </>
  )
}

export default MenuItem
