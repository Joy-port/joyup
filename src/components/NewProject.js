import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { project } from "../sliceReducers/actions/project"
import { bool, func } from "prop-types"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "react-feather"
import { tags } from "../sliceReducers/actions/tags"

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
    dispatch(
      project.createNewProject(projectContent, (projectID) => {
        setIsOpen(false)
        dispatch(tags.switchProject(projectID))
        navigate(`${projectID}`)
      })
    )
    navigate("/dashboard")
  }

  return (
    <div className="modal-bg transition-colors">
      <div className="modal-container modal-sm bg-light100">
        <div className="modal-header flex justify-between items-start">
          <h1 className="text-light300 heading-three mt-2">New Project</h1>
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
          className="modal-body overflow-y-auto flex flex-col gap-3"
          onSubmit={(e) => createNewProject(e)}
        >
          <label htmlFor="title" className="font-semibold">
            Title
          </label>
          <input
            className="rounded px-2 py-1"
            type="text"
            id="title"
            required
            value={projectTitle}
            onChange={(e) => {
              setProjectTitle(e.target.value)
            }}
            placeholder="give your project a title"
          />
          <div className="flex items-center gap-4">
            <label htmlFor="public" className="font-semibold mr-5">
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
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}

NewProject.propTypes = {
  setIsOpen: func.isRequired,
}

export default NewProject
