import { string } from "prop-types"
import React from "react"
import DragFunction from "../DragFunction"

const List = ({ type }) => {
  return (
    <div>
      <div className="flex align-bottom">
        <div className="">
          <p>group by</p>
          <selection>
            <option value=""></option>
          </selection>
        </div>
      </div>
      <DragFunction type={type} />
    </div>
  )
}

List.propTypes = {
  type: string,
}

export default List
