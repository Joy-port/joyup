import React, { createContext, useEffect } from "react"
import { useAsyncReducer } from "../helpers/useAsyncReducer"
import { any, string } from "prop-types"
import { firebase } from "../helpers/firebase"

export const initialProjectState = {
  totalProjects: [],
  ownerProjectList: [],
  collaborateProjectList: [],
  currentProjectID: "8gx8UcCs8cLC8V8s2SMK",
}

export async function projectReducer(state, action) {
  switch (action.type) {
    case "getAllProjects":
      const totalProject = await firebase.getTotalProjects()
      return { ...state, totalProjects: totalProject }
    case "getProjectList":
      const { userID } = action.payload
      const [ownerProjects, collaborateProjects] = await firebase.getUserProjects(userID)
      // projectList: projects, currentProjectID: projects[0]
      // console.log(ownerProjects)
      return {
        ...state,
        ownerProjectList: [...ownerProjects],
        collaborateProjectList: [...collaborateProjects],
        currentProjectID: ownerProjects[0].id,
      }
    case "switchProject":
      return { ...state, currentProjectID: action.payload }
    default:
      return state
  }
}

export const ProjectContext = createContext()

const ProjectProvider = ({ children, userID }) => {
  const [state, dispatch] = useAsyncReducer(projectReducer, initialProjectState)

  useEffect(() => {
    dispatch({ type: "getProjectList", payload: { userID } })
  }, [])

  return (
    <ProjectContext.Provider value={[state, dispatch]}>
      {children}
    </ProjectContext.Provider>
  )
}

ProjectProvider.propTypes = {
  children: any,
  userID: string,
}

export default ProjectProvider
