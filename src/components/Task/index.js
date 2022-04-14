import React from "react"
import TextEditor from "./TextEditor"
import { TaskContent, TextProvider, useTaskContext } from "./TaskReducer"

const index = () => {
  const value = useTaskContext()
  return (
    <>
      <button className="fixed bottom-5 right-5 text-lg bg-slateDark text-white rounded py-2 px-4">
        open task
      </button>
      <TextProvider>
        <div className="task-container">
          <div className="flex flex-col gap-3 w-3/4">
            <TextEditor />
          </div>
          <div className="flex flex-col gap-3">
            <p>
              Created date {value}: <br />
              {new Date().toLocaleString()}
            </p>
            <button>Due Date</button>
            <p>Already had Tomatos</p>
            <select name="number" value="none" id="">
              <option value="none" disabled>
                Select needed Tomato
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </TextProvider>
    </>
  )
}

export default index
