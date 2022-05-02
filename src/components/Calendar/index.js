import React, { useState, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Calendar, momentLocalizer } from "react-big-calendar"
import { v4 as uuidv4 } from "uuid"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import moment from "moment"
import { task } from "../../sliceReducers/actions/task"

const localizer = momentLocalizer(moment)
// const DragDropCalendar = withDragAndDrop(Calendar)

const index = () => {
  const { selectedProjectTaskList } = useSelector((state) => state.tags)
  const { totalTaskList } = useSelector((state) => state.projects)
  // const task = useSelector((state) => state.task)
  const [events, setEvents] = useState(Object.values(selectedProjectTaskList))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    setEvents(Object.values(selectedProjectTaskList))
  }, [selectedProjectTaskList])
  // const onDoubleClickEvent = (e) => {
  //   if (totalTaskList[e.id]) {
  //     dispatch({ type: "task/openSavedTask", payload: e })
  //     navigate(`/task/${e.id}`)
  //   }
  // }
  const handleSelectEvent = useCallback((event) => {
    if (totalTaskList[event.id]) {
      dispatch({ type: "task/openSavedTask", payload: event })
      navigate(`/task/${event.id}`)
    }
  })
  const handleSelectSlot = useCallback(({ start, end }) => {
    const newTaskID = uuidv4()
    const startTime = {
      name: "startDate",
      date: start,
    }
    const endTime = {
      name: "dueDate",
      date: end,
    }
    dispatch({ type: "createNewTask", payload: newTaskID })
    dispatch({ type: "task/editDate", payload: startTime })
    dispatch({ type: "task/editDate", payload: endTime })
    navigate(`/task/${newTaskID}`)
    navigate(0) // cause rerender QQ
  })

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
    <div className="">
      <Calendar
        dayLayoutAlgorithm="overlap"
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        style={{ height: "calc(100vh - 50px)" }}
        startAccessor="start"
        endAccessor="end"
        events={events}
        views={{
          day: true,
          week: true,
          month: true,
          year: true,
        }}
        resizable
        selectable
        // onDoubleClickEvent={onDoubleClickEvent} //onclick twice
        onSelectEvent={handleSelectEvent} //onclick once
        onSelectSlot={handleSelectSlot} //add event
        // onEventResize={onEventResize}
        // onEventDrop={onEventDrop}
        // popup //problem will break the view
      />
    </div>
  )
}

export default index
