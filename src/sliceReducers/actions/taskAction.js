import { firebase } from "../../helpers/firebase"
export const task = {
  checkTaskIDToOpen: (taskID) => {
    return async (dispatch, getState) => {
      const { totalTaskList } = getState().projects
      const taskDetail = totalTaskList[taskID]
      console.log(taskDetail)
      if (taskDetail === "") {
        //create new task
        dispatch({ type: "task/setTaskID", payload: taskID })
      } else {
        dispatch({ type: "task/getTaskDetails", payload: taskDetail })
      }
    }
  },
}
