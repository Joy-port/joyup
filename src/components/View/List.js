import { Fragment, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import * as Icon from "react-feather"
import { string } from "prop-types"
import { v4 as uuidv4 } from "uuid"
import { tags } from "../../store/actions/tags"
import DragFunction from "../DragFunction"

const List = ({ type }) => {
  const { selectedProjectTaskList } = useSelector((state) => state.tags)
  const { types, selectedType } = useSelector((state) => state.tags)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [openSelector, setOpenSelector] = useState(false)
  useEffect(() => {
    if (selectedProjectTaskList.length === 0) {
      dispatch({
        type: "alert/status",
        payload: { text: "Start create a new task!", type: "info" },
      })
    }
  }, [selectedProjectTaskList])
  return (
    <Fragment>
      <div className="tool-bar">
        {selectedProjectTaskList && JSON.stringify(selectedProjectTaskList) !== "{}" && (
          <div className="text-center rounded button-outline-light">
            <div
              className="group-title border-2 border-light000 rounded relative w-44 px-2 py-1 cursor-pointer"
              onClick={() => {
                setOpenSelector(!openSelector)
              }}
            >
              Group By {selectedType.type}
              {openSelector && (
                <div className="dropdown-container z-20 shadow shadow-blue100 border-t-2 border-t-light000">
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
          </div>
        )}
      </div>
      <div
        className={`${
          type === "list"
            ? "h-custom-lg overflow-y-auto overflow-x-hidden"
            : "h-custom-xl overflow-x-auto"
        } -ml-4 -mr-4  px-4 pb-2 scrollbar`}
      >
        {selectedProjectTaskList && JSON.stringify(selectedProjectTaskList) === "{}" ? (
          <Fragment>
            <div className="h-full flex flex-col gap-5 justify-center items-center ">
              <div
                className="cursor-pointer flex-col flex items-center gap-4 button-outline-primary"
                onClick={() => {
                  const newTaskID = uuidv4()
                  dispatch({ type: "task/createNewTask", payload: newTaskID })
                  navigate(`/tasks/${newTaskID}`)
                }}
              >
                <Icon.FilePlus size={40} strokeWidth={1} />
                <p>Create New Task</p>
              </div>
            </div>
          </Fragment>
        ) : (
          <DragFunction type={type} />
        )}
      </div>
    </Fragment>
  )
}

List.propTypes = {
  type: string.isRequired,
}

export default List
