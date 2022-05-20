import { firebase } from "../../utils/firebase"
import { tags } from "./tags"

export const project = {
  updateProjects: function () {
    return async function (dispatch, getState) {
      try {
        const { selectedProjectID } = getState().tags
        await firebase.getRealTimeData("projects", (projects) => {
          dispatch({ type: "projects/updateProjects", payload: projects })
          selectedProjectID
            ? dispatch(tags.switchProject(selectedProjectID))
            : dispatch(tags.initialProjectData())
        })
      } catch (err) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
  updateTags: function () {
    return async function (dispatch) {
      try {
        await firebase.getRealTimeData("tags", (tags) => {
          dispatch({ type: "projects/updateTagsDetail", payload: tags })
        })
      } catch (err) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
  updateTasks: function () {
    return async function (dispatch, getState) {
      try {
        const { selectedProjectID } = getState().tags
        await firebase.getRealTimeData("tasks", (tasks) => {
          dispatch({ type: "projects/updateAllTasks", payload: tasks })
          selectedProjectID
            ? dispatch(tags.switchProject(selectedProjectID))
            : dispatch(tags.initialProjectData())
        })
      } catch (err) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
  createNewProject: function (projectContent, callback, alert) {
    return async (dispatch, getState) => {
      try {
        const { projectTitle, isPublic } = projectContent
        const type = !isPublic ? "ownerProjects" : "collaborateProjects"
        const publicStatus = isPublic ? 1 : 0
        const { id } = getState().user
        const projectID = await firebase.createProjectWithDefaultTags(
          projectTitle,
          id,
          publicStatus
        )
        await firebase
          .saveProjectToUserProjects(id, projectID, type)
          .then(() => {
            callback && callback(projectID)
          })
          .then(() => {
            alert && alert(projectID)
          })
      } catch (error) {
        dispatch({ type: "status/error", payload: error })
      }
    }
  },
  deleteProject: function (projectID) {
    return async (dispatch, getState) => {
      try {
        const { id } = getState().user
        await firebase.deleteProject(projectID, id)
      } catch (error) {
        dispatch({ type: "status/error", payload: error })
      }
    }
  },
  createNewProjectFromTemplate: function (projectID, callback, alert) {
    return async (dispatch, getState) => {
      try {
        const { id } = getState().user
        const { totalProjectList } = getState().projects
        const selectedTemplate = {
          ...totalProjectList[projectID],
          isTemplate: 0,
          users: [id],
          isPublic: 0,
        }
        const newProjectID = await firebase.createProjectWithTemplate(
          selectedTemplate,
          id
        )
        await firebase
          .saveProjectToUserProjects(id, newProjectID, "ownerProjects")
          .then(() => {
            callback && callback(newProjectID)
          })
          .then(() => {
            alert && alert(newProjectID)
          })
          .catch((err) => console.error(err))
      } catch (error) {
        dispatch({ type: "status/error", payload: error })
      }
    }
  },
}
