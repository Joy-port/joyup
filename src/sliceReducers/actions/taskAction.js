import { firebase } from "../../helpers/firebase"
export const task = {
  getProjects: () => {
    return async function (dispatch, getState) {
      try {
        await firebase.getRealTimeData((tasks) => {
          dispatch({ type: "task/getAllTasks", payload: tasks })
        })
      } catch (err) {
        dispatch({ type: "ERROR", payload: err })
      }
    }
  },
}
