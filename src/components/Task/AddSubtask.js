import React, { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

const subTasks = [
  {
    id: uuidv4(),
    title: "asdkjalsdjlkasd",
  },
]

// eslint-disable-next-line react/prop-types
const AddSubtask = ({ children }) => {
  const [inputTitle, setInputTitle] = useState()
  const [subTaskList, setSubTaskList] = useState(subTasks)
  const inputRef = useRef()
  useEffect(() => {
    inputRef.current.focus()
  }, [inputRef])
  const addTasks = (e) => {
    e.preventDefault()
    const task = {
      id: uuidv4(),
      title: "",
    }
    setSubTaskList((prev) => {
      const prevArray = [...prev]
      prevArray.push(task)
      return [...prevArray]
    })
  }
  const changeTitle = (id) => {
    console.log(inputTitle)
    setInputTitle(inputTitle)
  }

  const openTask = (e, id) => {
    e.stopPropagation()
    console.log(e.target.value, id)
  }
  return (
    <>
      <button className="bg-slateDark text-white px-2 py-1 rounded" onClick={addTasks}>
        {children}
      </button>
      <ul>
        {subTaskList.length > 0 &&
          subTaskList.map((item) => (
            <li key={item.id} onClick={(e) => openTask(e, item.id)}>
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
    </>
  )
}

export default AddSubtask
