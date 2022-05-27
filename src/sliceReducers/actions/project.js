import { firebase } from "../../helpers/firebase"
import { v4 as uuidv4 } from "uuid"
export const project = {
  updateProjects: function () {
    return async function (dispatch, getState) {
      try {
        await firebase.getRealTimeData("projects", (projects) => {
          dispatch({ type: "projects/updateProjects", payload: projects })
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
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  updateTasks: function () {
    return async function (dispatch, getState) {
      try {
        await firebase.getRealTimeData("tasks", (tasks) => {
          dispatch({ type: "projects/updateAllTasks", payload: tasks })
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  getTemplates: function () {
    return async function (dispatch, getState) {
      try {
        const { totalProjectList } = getState().projects
        const templateProjects = Object.values(totalProjectList).filter(
          (project) => project.isTemplate === 1
        )
        dispatch({ type: "projects/updateTemplate", payload: templateProjects })
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
        const publicStatus = isPublic ? 1 : 0
        const { id } = getState().user
        const projectID = await firebase.createProjectWithDefaultTags(
          projectTitle,
          id,
          publicStatus
        )
        await firebase.saveProjectToUserProjects(id, projectID, type).then(() => {
          callback && callback(projectID)
        })
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
  deleteProject: function (projectID) {
    return async (dispatch, getState) => {
      try {
        const { id } = getState().user
        await firebase.deleteProject(projectID, id)
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
  createNewProjectFromTemplate: function (projectID, callback) {
    return async (dispatch, getState) => {
      try {
        const newProjectID = uuidv4()
        const { id } = getState().user
        const { totalProjectList } = getState().projects
        const selectedTemplate = {
          ...totalProjectList[projectID],
          isTemplate: 0,
          users: [id],
          isPublic: 0,
          id: newProjectID,
        }
        const duplicateTasksInTemplate = await firebase.duplicateTasksForNewProject(
          selectedTemplate
        )
        const duplicateProjectDetail = await firebase.duplicateProjectDetail(
          selectedTemplate,
          duplicateTasksInTemplate
        )
        const newProject = {
          ...selectedTemplate,
          ...duplicateProjectDetail,
        }
        // console.log(newProject)
        await firebase.createProjectWithTemplate(newProject, id)
        await firebase
          .saveProjectToUserProjects(id, newProjectID, "ownerProjects")
          .then(() => {
            callback && callback(newProjectID)
          })
          .catch((err) => console.error(err))
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
}
