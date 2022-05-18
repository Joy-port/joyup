import React, { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Plus } from "react-feather"
import { any } from "prop-types"
import { v4 as uuidv4 } from "uuid"

const AddSubtask = () => {
  const { id } = useSelector((state) => state.task)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [inputTitle, setInputTitle] = useState()
  const [subTaskList, setSubTaskList] = useState(subTasks)
  const inputRef = useRef()
  useEffect(() => {
    if (subTaskList.length !== 0) {
      inputRef.current.focus()
    }
  }, [inputRef])
  const addTasks = (e) => {
    e.preventDefault()
    const task = {
      id: uuidv4(),
      title: "",
      parent: id,
    }
    setSubTaskList((prev) => {
      const prevArray = [...prev]
      prevArray.push(task)
      return [...prevArray]
    })
    dispatch(task.saveSubtask())
  }
  const changeTitle = (id) => {
    // console.log(inputTitle)
    setInputTitle(inputTitle)
  }

  const openTask = (e, id) => {
    e.stopPropagation()
    // console.log(e.target.value, id)
    navigate(`/tasks/${id}`)
  }
  return (
    <div className="bg-white p-3 rounded">
      <div className="flex justify-between">
        <p className="border-group-title heading-three">To Dos</p>

        <button
          className="button button-outline-dark flex justify-center items-center gap-2 text-sm"
          onClick={addTasks}
        >
          <Plus size={14} />
          <p>Subtasks</p>
        </button>
      </div>
      <ul>
        {subTaskList.length !== 0 &&
          subTaskList.map((item) => (
            <li
              key={item.id}
              className="cursor-pointer"
              onClick={(e) => openTask(e, item.id)}
            >
              <input
                type="text"
                value={inputTitle && item.title}
                onChange={() => changeTitle(item.id)}
                onClick={(e) => {
                  inputRef.current = e.target
                }}
                ref={inputRef}
              />
              <button className="bg-blue text-white px-2 py-1 rounded">delete</button>
            </li>
          ))}
      </ul>
    </div>
  )
}

AddSubtask.propTypes = {
  children: any,
}

export default AddSubtask
