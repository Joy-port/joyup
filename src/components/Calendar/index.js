import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import MonthToolbar from "./Toolbar/Month"
import { v4 as uuidv4 } from "uuid"
import { task } from "../../sliceReducers/actions/task"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"

const localizer = momentLocalizer(moment)
// const DragDropCalendar = withDragAndDrop(Calendar)

const index = () => {
  const currentRef = useRef()
  const { calendarView } = useParams()
  const bigCalendar = useMemo(
    () => ({
      components: {
        toolbar: MonthToolbar,
      },
      dayLayoutAlgorithm: "overlap",
      localizer: localizer,
      defaultDate: new Date(),
      defaultView: calendarView,
      startAccessor: "start",
      endAccessor: "end",
      views: ["day", "week", "month"],
    }),
    []
  )
  const { selectedProjectTaskList } = useSelector((state) => state.tags)
  const taskDetail = useSelector((state) => state.task)
  const { totalTaskList } = useSelector((state) => state.projects)
  // const task = useSelector((state) => state.task)
  const [events, setEvents] = useState(Object.values(selectedProjectTaskList))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      window.clearTimeout(currentRef?.current)
    }
  }, [])

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
  const createTaskWhenSelected = useCallback(({ slot, start, end }) => {
    window.clearTimeout(currentRef?.current)
    currentRef.current = window.setTimeout(() => {
      const newTaskID = uuidv4()
      dispatch(task.createTaskFromCalendar(newTaskID, start, end))
      dispatch(task.saveTotalTask())
    }, 100)
  }, [])

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
    <div className="h-custom-m overflow-y-auto pb-20 scrollbar">
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
        // onDoubleClickEvent={openTaskModal} //onclick twice
        // onSelectSlot={createTaskWhenSelected} //add event
        onSelecting={createTaskWhenSelected} //add event
        onSelectEvent={openTaskModal} //onclick once
        // onEventResize={onEventResize}
        // onEventDrop={onEventDrop}
        eventPropGetter={eventPropGetter}
        timeslots={2}
        step={30}
        components={bigCalendar.components}
      />
    </div>
  )
}

export default index
