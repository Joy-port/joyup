import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import DayToolbar from "./Toolbar/Day"
import MonthToolbar from "./Toolbar/Month"
import { v4 as uuidv4 } from "uuid"
import { task } from "../../sliceReducers/actions/task"
import EventModal from "./EventModal"
import { string, any } from "prop-types"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import dayjs from "dayjs"
import { X, Edit3 } from "react-feather"
// import { Overlay, OverlayTrigger, Popover } from "react-bootstrap"

const localizer = momentLocalizer(moment)
const DragDropCalendar = withDragAndDrop(Calendar)

// const ToolTipTasks = ({ onClose, event }) => {
//   const navigate = useNavigate()
//   const taskDetail = useSelector((state) => state.task)
//   return (
//     <Popover id="popover-trigger-click-root-close" style={{ zIndex: 10000 }}>
//       <div className={`modal-container-popUp h-36 w-60 text-light300`}>
//         <div className="flex justify-between items-center mb-2">
//           <div className="text-lg font-semibold ">{event.title}</div>
//           <div className="cursor-pointer" onClick={onClose}>
//             <X />
//           </div>
//         </div>
//         <div className="">
//           Start : {dayjs(new Date(taskDetail.startDate)).format("MMM DD, HH:MM")}
//         </div>
//         <div className="">
//           Due : {dayjs(new Date(taskDetail.dueDate)).format("MMM DD, HH:MM")}
//         </div>
//         <div className="button button-dark ml-auto cursor-pointer w-10">
//           <Edit3 size={20} />
//         </div>
//       </div>
//     </Popover>
//   )
// }
// const Event = (event) => {
//   const popoverClickRootClose = () => <ToolTipTasks />

//   const [showTooltip, setShowTooltip] = useState(false)

//   const closeTooltip = (e) => {
//     setShowTooltip(false)
//     e.stopPropagation()
//   }

//   const openTooltip = (e) => {
//     setShowTooltip(true)
//     e.stopPropagation()
//   }
//   const ref = useRef(null)
//   const getTarget = () => {
//     // return ReactDOM.findDOMNode(ref.current)
//     console.log("run modal")
//   }
//   return (
//     <div className="">
//       <OverlayTrigger
//         id="help"
//         trigger="click"
//         rootClose
//         placement="top"
//         overlay={popoverClickRootClose}
//       ></OverlayTrigger>
//       {/* {showTooltip && (
//         <div
//           className="fixed"
//           // style={{
//           //   position: "absolute",
//           //   inset: "0px auto auto 0px",
//           //   minWidth: "154.066px",
//           //   transform: "translate3d(275px, 524.5px, 0px)",
//           // }}
//         >
//           <ToolTipTasks event={event} onClose={closeTooltip} />
//         </div>
//       )} */}
//     </div>
//   )
// }

const index = ({ type }) => {
  const [onClickPlace, setOnClickPlace] = useState({})
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [actionType, setActionType] = useState("")
  const [newTaskID, setNewTaskID] = useState("")
  const currentRef = useRef()
  const { calendarView } = useParams()
  const bigCalendar = useMemo(
    () => ({
      components: {
        toolbar: type === "day" ? DayToolbar : MonthToolbar,
        // event: Event,
      },
      dayLayoutAlgorithm: "overlap",
      localizer: localizer,
      defaultDate: new Date(),
      defaultView: type === "day" ? "week" : calendarView,
      startAccessor: "start",
      endAccessor: "end",
      views: { day: true, week: true, month: true },
    }),
    []
  )
  const { selectedProjectTaskList } = useSelector((state) => state.tags)
  const { totalTaskList } = useSelector((state) => state.projects)
  const [events, setEvents] = useState(Object.values(selectedProjectTaskList))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (newTaskID) {
      setIsOpenModal(true)
    }
  }, [newTaskID])

  const eventPropGetter = useCallback((event, start, end, isSelected) => {
    return {
      ...(isSelected && {
        style: {
          backgroundColor: "#000",
        },
      }),
      ...(event.title.toLowerCase().includes("meeting") && {
        style: {
          backgroundColor: "#46af6b",
        },
      }),
    }
  }, [])
  const openTaskModal = useCallback((event) => {
    window.clearTimeout(currentRef?.current)
    currentRef.current = window.setTimeout(() => {
      if (totalTaskList[event.id]) {
        dispatch({ type: "task/openSavedTask", payload: event })
        navigate(`/tasks/${event.id}`)
      }
    }, 100)
  }, [])
  const createTaskWhenSelected = useCallback(({ box, start, end, action, bounds }) => {
    if (action === undefined) return
    window.clearTimeout(currentRef?.current)
    currentRef.current = window.setTimeout(() => {
      const newTaskID = uuidv4()
      if (action === "select") {
        if (bounds === undefined) return
        setActionType("select")
        setOnClickPlace(bounds)
        dispatch(task.createTaskFromCalendar(newTaskID, start, end))
        dispatch(task.saveTotalTask())
        setNewTaskID(newTaskID)
      } else if (action === "doubleClick") {
        if (box === undefined) return
        setActionType("click")
        setOnClickPlace(box)
        dispatch(task.createTaskFromCalendar(newTaskID, start, end))
        dispatch(task.saveTotalTask())
        setIsOpenModal(true)
      }
    }, 100)
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(currentRef?.current)
    }
  }, [createTaskWhenSelected, openTaskModal])
  useEffect(() => {
    if (isOpenModal) {
      dispatch(task.deleteCurrentTask())
      dispatch({ type: "task/clearTaskWithoutSaving" })
      setIsOpenModal(false)
    }
  }, [calendarView])

  useEffect(() => {
    setEvents(Object.values(selectedProjectTaskList))
  }, [selectedProjectTaskList])

  const onEventResize = (data) => {
    const { start, end } = data
    console.log("%c start ", "color:orange", start)
    console.log("%c end ", "color:orange", end)

    // this.setState((state) => {
    //   state.events[0].start = start
    //   state.events[0].end = end
    //   return { events: [...state.events] }
    // })
  }
  //wait to fix
  const moveEvent = (draggedEventData) => {
    const { start, end, isAllDay, resourceId, event } = draggedEventData
    // 直接改 task 的 start end 存到  firebase
    //存 task state
    const taskID = event.id
    dispatch(task.checkTaskIDToOpen(taskID))
    const startTime = {
      name: "startDate",
      date: new Date(start).getTime(),
    }
    const endTime = {
      name: "dueDate",
      date: new Date(end).getTime(),
    }
    dispatch(task.saveTaskDate(startTime))
    dispatch(task.saveTaskDate(endTime))
    dispatch(task.saveTotalTask())
  }

  return (
    <div className="h-custom-xxl overflow-y-auto pb-20 scrollbar relative">
      <DragDropCalendar
        dayLayoutAlgorithm={bigCalendar.dayLayoutAlgorithm}
        localizer={bigCalendar.localizer}
        defaultDate={bigCalendar.defaultDate}
        defaultView={bigCalendar.defaultView}
        style={{ height: "calc(100vh - 150px)" }}
        startAccessor={bigCalendar.startAccessor}
        endAccessor={bigCalendar.endAccessor}
        events={events}
        views={bigCalendar.views}
        resizable
        selectable
        longPressThreshold={20}
        onSelectSlot={createTaskWhenSelected} //add event
        onSelectEvent={openTaskModal} //onclick once
        // onDoubleClickEvent={openTaskModal} //onclick twice
        // onSelecting={createTaskWhenSelected} //add event
        onEventDrop={moveEvent}
        // onEventResize={onEventResize}
        eventPropGetter={eventPropGetter}
        timeslots={2}
        step={30}
        components={bigCalendar.components}
        popup
        tooltipAccessor={null}
      />

      {isOpenModal && (
        <EventModal
          type={actionType}
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          position={onClickPlace}
        />
      )}
    </div>
  )
}
// ToolTipTasks.propTypes = {
//   onClose: any,
//   event: any,
// }
index.propTypes = {
  type: string,
}

export default index
