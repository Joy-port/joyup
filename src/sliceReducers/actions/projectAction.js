import { firebase } from "../../helpers/firebase"

export const projects = {
  updateProjects: function () {
    return async function (dispatch) {
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
    return async function (dispatch) {
      try {
        await firebase.getRealTimeData("tasks", (tasks) => {
          dispatch({ type: "projects/updateAllTasks", payload: tasks })
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
}
