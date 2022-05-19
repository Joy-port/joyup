import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, momentLocalizer } from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import { string } from "prop-types"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { task } from "../../store/actions/task"
import Toolbar from "./Toolbar"
import EventModal from "./EventModal"

const localizer = momentLocalizer(moment)
const DragDropCalendar = withDragAndDrop(Calendar)

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
        toolbar: (props) => <Toolbar type={type} {...props} />,
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
        const taskDetail = JSON.parse(JSON.stringify(totalTaskList[event.id]))
        dispatch({ type: "task/openSavedTask", payload: taskDetail })
        navigate(`/tasks/${taskDetail.id}`)
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

  const moveEvent = (draggedEventData) => {
    const { start, end, isAllDay, resourceId, event } = draggedEventData
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
        onSelectSlot={createTaskWhenSelected}
        onSelectEvent={openTaskModal}
        onEventDrop={moveEvent}
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
index.propTypes = {
  type: string,
}

export default index
