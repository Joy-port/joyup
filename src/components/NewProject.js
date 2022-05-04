import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { project } from "../sliceReducers/actions/project"
import { func } from "prop-types"
import { useNavigate } from "react-router-dom"

const NewProject = ({ setIsOpen }) => {
  const [projectTitle, setProjectTitle] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createNewProject = (e) => {
    e.preventDefault()
    if (projectTitle.trim() === "") {
      alert("please give the project a title")
      return
    }
    const projectContent = {
      projectTitle,
      isPublic,
    }
    console.log(projectContent)
    dispatch(
      project.createNewProject(projectContent, () => {
        setIsOpen(false)
      })
    )
  }

  return (
    <div className="modal-bg">
      <div className="modal-container">
        <button
          className="modal-close block"
          onClick={() => {
            setProjectTitle("")
            setIsPublic(false)
            setIsOpen(false)
          }}
        >
          X
        </button>
        <h1 className="text-slateDark heading-two mb-4">Create New Project</h1>
        <form className="flex flex-col" onSubmit={(e) => createNewProject(e)}>
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            required
            value={projectTitle}
            onChange={(e) => {
              if (e.target.value.trim() !== "") {
                setProjectTitle(e.target.value)
              }
            }}
          />
          <div className="flex items-center gap-4">
            <label htmlFor="public" className="mr-5">
              Public
            </label>
            <input
              className="block"
              type="checkbox"
              id="public"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
          </div>
          <button className="button button-dark" onClick={(e) => createNewProject(e)}>
            Create New Project
          </button>
        </form>
      </div>
    </div>
  )
}

NewProject.propTypes = {
  setIsOpen: func,
}

export default NewProject
