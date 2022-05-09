import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import DayToolbar from "./Toolbar/Day"
import MonthToolbar from "./Toolbar/Month"
import AgendaToolbar from "./Toolbar/Agenda"
import { v4 as uuidv4 } from "uuid"
import { task } from "../../sliceReducers/actions/task"
import EventModal from "./EventModal"
import { string } from "prop-types"
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"

const localizer = momentLocalizer(moment)
// const DragDropCalendar = withDragAndDrop(Calendar)

const index = ({ type }) => {
  const [onClickPlace, setOnClickPlace] = useState({})
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [actionType, setActionType] = useState("")
  const currentRef = useRef()
  const { calendarView } = useParams()
  const bigCalendar = useMemo(
    () => ({
      components: {
        toolbar: type === "day" ? DayToolbar : MonthToolbar,
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
        navigate(`/task/${event.id}`)
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
        setIsOpenModal(true)
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
  const onEventDrop = (draggedEventData) => {
    const { start, end, isAllDay, resourceId, event } = draggedEventData
    // 直接改 task 的 start end 存到  firebase
    //存 task state
    const taskID = event.id
    dispatch(task.checkTaskIDToOpen(taskID))
    const startTime = {
      name: "startDate",
      date: new Date(start),
    }
    const endTime = {
      name: "dueDate",
      date: new Date(end),
    }
    dispatch(task.saveTaskDate(startTime))
    dispatch(task.saveTaskDate(endTime))
    dispatch(task.saveTotalTask())
  }

  return (
    <div className="h-custom-xxl overflow-y-auto pb-20 scrollbar relative">
      <Calendar
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
        // onEventResize={onEventResize}
        // onEventDrop={onEventDrop}
        eventPropGetter={eventPropGetter}
        timeslots={2}
        step={30}
        components={bigCalendar.components}
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
