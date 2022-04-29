import { firebase } from "../../helpers/firebase"

export const projects = {
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
          console.log(tags)
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
}
