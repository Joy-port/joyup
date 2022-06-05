import { firebase } from "../../utils/firebase"
const getDefaultTags = (types) => {
  const taskTagDetail = types.map((type) => {
    const defaultTag = {
      parent: type.id,
      child: type.children[0].id,
      type: type.type,
    }
    return defaultTag
  })
  return taskTagDetail
}

export const task = {
  checkTaskIDToOpen: (taskID) => {
    return async (dispatch, getState) => {
      const { totalTaskList } = getState().projects
      const taskDetail = totalTaskList[taskID]
      if (taskDetail === "") {
        dispatch({ type: "task/setTaskID", payload: taskID })
      } else {
        dispatch({ type: "task/getTaskDetails", payload: taskDetail })
      }
    }
  },
  saveTaskTag: (tagContent) => {
    return async (dispatch, getState) => {
      try {
        const newTagState = [...getState().task.tagList]
        const { parent, child } = tagContent
        if (newTagState.some((item) => item.parent === parent)) {
          newTagState.find((item) => item.parent === parent).child = child
        } else {
          newTagState.push(tagContent)
        }
        dispatch({ type: "task/editTags", payload: newTagState })
      } catch (err) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
  saveTaskDate: (dateContent) => {
    return async (dispatch, getState) => {
      try {
        const { id } = getState().task
        dispatch({ type: "task/editDate", payload: dateContent })
        await firebase.saveTaskPartialContent(id, {
          [dateContent.name]: dateContent.date,
        })
      } catch (err) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
  saveTaskDetail: (type, content) => {
    return async (dispatch, getState) => {
      try {
        const { id } = getState().task
        const actionType = `task/${type}`
        dispatch({ type: actionType, payload: content })
        if (!id) return
        await firebase.saveTaskPartialContent(id, {
          [type]: content,
        })
      } catch (err) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
  saveTotalTask: (successAlert) => {
    return async (dispatch, getState) => {
      try {
        const { task } = getState()
        task.tagList.forEach(async (tagContent) => {
          const content = {
            parentTag: tagContent.parent,
            childTag: tagContent.child,
            taskID: task.id,
            projectID: task.projectID,
          }
          await firebase.saveTagsToProjectID(content)
        })
        await firebase.saveTask(task).then(() => {
          successAlert && successAlert()
        })
      } catch (err) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
  createTaskFromCalendar: (taskID, start, end) => {
    return async (dispatch, getState) => {
      try {
        const { types, selectedProjectID } = getState().tags
        const defaultTagList = getDefaultTags(types)
        const startTime = {
          name: "startDate",
          date: new Date(start).getTime(),
        }
        const endTime = {
          name: "dueDate",
          date: new Date(end).getTime(),
        }
        dispatch({ type: "task/createNewTask", payload: taskID })
        dispatch({ type: "task/editDate", payload: startTime })
        dispatch({ type: "task/editDate", payload: endTime })
        dispatch({ type: "task/title", payload: "New Task" })
        dispatch({ type: "task/projectID", payload: selectedProjectID })
        dispatch({ type: "task/editTags", payload: defaultTagList })
      } catch (error) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
  deleteCurrentTask: () => {
    return async (dispatch, getState) => {
      try {
        const { id, projectID, tagList } = getState().task
        await firebase.deleteTaskFromTaskAndProjects(id, projectID, tagList)
      } catch (error) {
        dispatch({ type: "status/error", payload: err })
      }
    }
  },
}
