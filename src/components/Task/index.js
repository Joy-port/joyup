import React, { useState } from "react"
import SettingEditor from "./SettingEditor"
import TextEditor from "./TextEditor"
import { TaskContent, TextProvider, useTaskContext } from "./TaskReducer"
import DatePicker from "./DatePicker"

const index = () => {
  const value = useTaskContext()
  const [dueDate, setDueDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  return (
    <>
      <button className="fixed bottom-5 right-5 text-lg bg-slateDark text-white rounded py-2 px-4">
        open task
      </button>
      <TextProvider>
        <div className="task-container">
          <div className="flex flex-col gap-3 w-3/4">
            <SettingEditor />
            <TextEditor />
          </div>
          <div className="flex flex-col gap-3">
            <p>
              Created date {value}: <br />
              {new Date().toLocaleString()}
            </p>

            <div>Start Date</div>
            <DatePicker setDate={setStartDate} date={startDate} />
            <div>Due Date</div>
            <DatePicker setDate={setDueDate} date={dueDate} />
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
