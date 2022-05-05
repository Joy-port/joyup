import { string } from "prop-types"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { tags } from "../../sliceReducers/actions/tags"
import DragFunction from "../DragFunction"

const List = ({ type }) => {
  const { types, selectedType } = useSelector((state) => state.tags)
  const dispatch = useDispatch()
  const [openSelector, setOpenSelector] = useState(false)
  return (
    <>
      <div className="tool-bar">
        {/* <div className="flex">
          <input type="text" placeholder="Search" />
          <Search />
        </div> */}
        <div className="text-center rounded button-outline-light">
          <div
            className="group-title border-1 border-light000 rounded relative w-44 px-2 py-1"
            onClick={() => {
              setOpenSelector(!openSelector)
            }}
          >
            Group By {selectedType.type}
            {openSelector && (
              <div className="dropdown-container">
                <ul className="dropdown-list">
                  {types.map((type) => (
                    <li
                      className="dropdown-item"
                      value={type.id}
                      key={type.id}
                      onClick={() => {
                        dispatch(tags.switchType(type.id))
                        setOpenSelector(false)
                      }}
                    >
                      {type.type}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* <select
            value={selectedType.id || -1}
            onChange={(e) => dispatch(tags.switchType(e.target.value))}
          >
            <option value={-1}>please select</option>
            {types.map((type) => (
              <option value={type.id} key={type.id}>
                {type.type}
              </option>
            ))}
          </select> */}
        </div>
      </div>
      <div className="h-custom-l -ml-4 -mr-4 overflow-auto px-4 pb-2 scrollbar">
        <DragFunction type={type} />
      </div>
    </>
  )
}

List.propTypes = {
  type: string,
}

export default List
