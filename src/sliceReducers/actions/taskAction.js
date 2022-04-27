import TaskList from "../../components/Task/TaskList"
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
  saveTaskTag: (tagContent) => {
    return async (dispatch, getState) => {
      try {
        const newTagState = [...getState().task.tags]
        const { parent, child } = tagContent
        if (newTagState.some((item) => item.parent === parent)) {
          newTagState.find((item) => item.parent === parent).child = child
        } else {
          newTagState.push(tagContent)
        }
        dispatch({ type: "task/editTags", payload: newTagState })
        //firebase save to task
        //firebase save to project
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  saveTaskDate: (dateContent) => {
    return async (dispatch, getState) => {
      try {
        dispatch({ type: "task/editDate", payload: dateContent })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  saveTaskDetail: (type, content) => {
    return async (dispatch, getState) => {
      try {
        console.log(type, content)
        const { id } = getState().task
        const actionType = `task/${type}`
        dispatch({ type: actionType, payload: content })
        await firebase.saveTaskPartialContent(id, {
          [type]: content,
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  saveTotalTask: () => {
    return async (dispatch, getState) => {
      try {
        const { task } = getState()
        console.log(task)
        await firebase.saveTask(task)
        task.tags.forEach(async (tagContent) => {
          const content = {
            childTag: tagContent.child,
            taskID: task.id,
            projectID: task.projectID,
          }
          await firebase.saveTagsToProjectID(content)
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
}
