import { string } from "prop-types"
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import * as Icon from "react-feather"
import { tags } from "../../sliceReducers/actions/tags"
import DragFunction from "../DragFunction"
import { v4 as uuidv4 } from "uuid"
// import ViewNavigator from "./ViewNavigator"

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
    <>
      <div className="tool-bar">
        {/* <ViewNavigator /> */}
        {/* <div className="flex gap-3">
          {viewInfo.map((view) => {
            const IconName = Icon[view.icon]
            const isActive = pathname.split("/").includes(view.path)
            const calendarDefaultView = view.name === "Calendar" ? "/month" : ""
            return (
              <Link
                key={view.path}
                to={`/projects/${state.selectedProjectID}/${view.path}${calendarDefaultView}`}
                className={`menu-item ${
                  isActive ? "menu-item__dark--active" : "menu-item__dark"
                }`}
              >
                <IconName />
                <p className="lg:block hidden">{view.name}</p>
              </Link>
            )
          })}
        </div> */}
        {selectedProjectTaskList && JSON.stringify(selectedProjectTaskList) !== "{}" && (
          <div className="text-center rounded button-outline-light">
            <div
              className="group-title border-2 border-light000 rounded relative w-44 px-2 py-1"
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
          <>
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
          </>
        ) : (
          <DragFunction type={type} />
        )}
      </div>
    </>
  )
}

List.propTypes = {
  type: string.isRequired,
}

export default List
