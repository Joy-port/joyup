import { firebase } from "../../helpers/firebase"

export const project = {
  updateProjects: function () {
    return async function (dispatch) {
      try {
        await firebase.getRealTimeData("projects", (projects) => {
          dispatch({ type: "projects/updateProjects", payload: projects })
          // console.log("%c listen projectData ", "background: #ffeecc; color:#225566")
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  updateTags: function () {
    return async function (dispatch) {
      try {
        await firebase.getRealTimeData("tags", (tags) => {
          dispatch({ type: "projects/updateTagsDetail", payload: tags })
          // console.log("%c listen tagsDate ", "background: #ffeecc; color:#225566")
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  updateTasks: function () {
    return async function (dispatch) {
      try {
        await firebase.getRealTimeData("tasks", (tasks) => {
          dispatch({ type: "projects/updateAllTasks", payload: tasks })
          // console.log("%c listen tasksDate ", "background: #ffeecc; color:#225566")
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  createNewProject: function (projectContent, callback) {
    return async (dispatch, getState) => {
      try {
        const { projectTitle, isPublic } = projectContent
        const type = !isPublic ? "ownerProjects" : "collaborateProjects"
        const { id } = getState().user
        const projectID = await firebase.createProjectWithDefaultTags(projectTitle, id)
        await firebase.saveProjectToUserProjects(id, projectID, type)
        callback && callback()
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
}
