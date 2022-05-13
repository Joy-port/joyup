import { firebase } from "../../helpers/firebase"

export const project = {
  updateProjects: function () {
    return async function (dispatch) {
      try {
        await firebase.getRealTimeData("projects", (projects) => {
          dispatch({ type: "projects/updateProjects", payload: projects })
          const projectTasks = Object.keys(projects).flatMap((projectID) => {
            return projects[projectID].tasks
          })
          dispatch({ type: "user/getUserTasks", payload: projectTasks })
          console.log("%c listen project update", "background: #ffeecc; color:#225566")
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
          console.log("%c listen tags update ", "background: #ffeecc; color:#225566")
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
          console.log("%c listen tasks update ", "background: #ffeecc; color:#225566")
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
            // console.log(callback)
            callback && callback(newProjectID)
          })
          .catch((err) => console.error(err))
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
}
