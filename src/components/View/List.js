import { string } from "prop-types"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { tags } from "../../sliceReducers/actions/tagsAction"
import DragFunction from "../DragFunction"

const List = ({ type }) => {
  const { types, selectedType } = useSelector((state) => state.tags)
  const dispatch = useDispatch()
  return (
    <div>
      <div className="flex align-bottom">
        <div className="">
          <p>group by</p>
          <select
            value={selectedType.id || -1}
            onChange={(e) => dispatch(tags.switchType(e.target.value))}
          >
            <option value={-1}>please select</option>
            {types.map((type) => (
              <option value={type.id} key={type.id}>
                {type.type}
              </option>
            ))}
          </select>
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
