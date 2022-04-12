import React from "react"
import PropTypes from "prop-types"
import classnames from "classnames"

function Button({ size, bgColor, textColor, children }) {
  return (
    <button
      className={classnames(
        `bg-${bgColor} text-${textColor} font-bold py-2 px-4 rounded block`,
        {
          "text-xs": size === "xs",
          "text-sm": size === "sm",
          "text-md": size === "md",
          "text-lg": size === "lg",
          "text-xl": size === "xl",
          "text-2xl": size === "2xl",
        }
      )}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  size: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  children: PropTypes.any,
}

export default Button
