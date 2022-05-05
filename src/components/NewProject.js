import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { project } from "../sliceReducers/actions/project"
import { func } from "prop-types"
import { useNavigate } from "react-router-dom"
import { FolderPlus } from "react-feather"

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
      <div className="modal-container modal-sm">
        <div className="modal-header flex justify-between items-start">
          <h1 className="text-light300 heading-three mt-2">Project</h1>
          <button
            onClick={() => {
              setProjectTitle("")
              setIsPublic(false)
              setIsOpen(false)
            }}
          >
            X
          </button>
        </div>
        <form
          className="modal-body flex flex-col gap-3"
          onSubmit={(e) => createNewProject(e)}
        >
          <label htmlFor="title">Title</label>
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
        </form>
        <div className="modal-footer">
          <button
            className="w-full button button-dark flex items-center justify-center gap-3"
            onClick={(e) => createNewProject(e)}
          >
            <FolderPlus />
            Create New Project
          </button>
        </div>
      </div>
    </div>
  )
}

NewProject.propTypes = {
  setIsOpen: func,
}

export default NewProject
