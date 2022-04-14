import React from "react"
// import CommandList from "./CommandList"
import TextEditor from "./TextEditor"
import CommandList from "./CommandList"

const index = () => {
  return (
    <>
      <div>
        <button className="fixed bottom-5 right-5 text-lg bg-slateDark text-white rounded py-2 px-4">
          open task
        </button>
        <div className="task-container">
          <div className="flex flex-col gap-3 w-3/4">
            {/* <input type="text" placeholder="title" className="" /> */}
            {/* <textarea
              name="description"
              id="description"
              cols="30"
              rows="10"
              placeholder="description"
            ></textarea> */}
            {/* <TextEditor /> */}
            <CommandList />
          </div>
          <div className="flex flex-col gap-3">
            <p>
              Created date: <br />
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
      </div>
    </>
  )
}

export default index
