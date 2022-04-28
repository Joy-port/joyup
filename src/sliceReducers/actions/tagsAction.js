import { firebase } from "../../helpers/firebase"

function filterSelectedTypeTags(
  selectedProject,
  selectedType,
  totalTagList,
  totalTaskList,
  totalProjectList
) {
  const selectedColumns = {}
  const selectedTasks = []
  const currentProject = totalProjectList[selectedProject]
  currentProject[selectedType].forEach((tagID) => {
    selectedColumns[tagID] = {
      id: tagID,
      title: totalTagList[tagID].name,
      taskIds: currentProject[tagID] || [],
    }
    currentProject[tagID].forEach((taskid) => {
      if (totalTaskList[taskid]) {
        selectedTasks.push(totalTaskList[taskid])
      }
    })
  })

  return [selectedColumns, selectedTasks]
}

export const tags = {
  initialProjectData: function () {
    return async (dispatch, getState) => {
      try {
        //get initial all project Data
        const { totalTagList, totalProjectList, totalTaskList } = getState().projects
        console.log(totalTagList, totalProjectList, totalTaskList)
        const { ownerProjects } = getState().user
        const projectID = ownerProjects[0]
        const initialProject = totalProjectList[projectID]
        console.log(initialProject)
        const projectTasks = initialProject.tasks
        const projectTaskDetail = {}
        projectTasks.forEach((taskID) => {
          projectTaskDetail[taskID] = {
            title: totalTaskList[taskID].title,
            id: totalTaskList[taskID].id,
          }
        })
        const projectTotalTagsParent = initialProject.tags
        const projectTotalTypes = projectTotalTagsParent.map((typeId) => {
          const type = {
            type: totalTagList[typeId].name,
            id: totalTagList[typeId].id,
            children: initialProject[typeId].map((tagID) => totalTagList[tagID]),
          }
          return type
        })
        //get first type tags
        const selectedTypeData = projectTotalTypes[0]
        const initialTypeID = projectTotalTagsParent[0]
        const selectedColumnOrder = initialProject[initialTypeID]
        const [selectedColumns, selectedTasks] = filterSelectedTypeTags(
          projectID,
          initialTypeID,
          totalTagList,
          totalTaskList,
          totalProjectList
        )
        const selectedTag = {
          selectedTypeData,
          selectedColumns,
          selectedTasks,
          selectedColumnOrder,
        }

        dispatch({ type: "tags/selectedProject", payload: projectID })
        dispatch({ type: "task/selectedProject", payload: projectID })
        dispatch({ type: "tags/getProjectTasks", payload: projectTaskDetail })
        dispatch({ type: "tags/getProjectInitialTypes", payload: projectTotalTypes })
        dispatch({ type: "tags/switchType", payload: selectedTag })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  switchProject: function (projectID) {
    return async (dispatch, getState) => {
      try {
        //get initial all project Data
        const { totalTagList, totalProjectList, totalTaskList } = getState().projects
        const currentProject = totalProjectList[projectID]
        const projectTasks = currentProject.tasks
        const projectTaskDetail = {}
        projectTasks.forEach((taskID) => {
          projectTaskDetail[taskID] = {
            ...totalTaskList[taskID],
            // createdDate: new Date(totalTaskList[taskID].createdDate),
            // startDate: new Date(totalTaskList[taskID].startDate),
            // dueDate: new Date(totalTaskList[taskID].dueDate),
          }
        })
        const projectTotalTagsParent = currentProject.tags
        const projectTotalTypes = projectTotalTagsParent.map((typeId) => {
          const type = {
            type: totalTagList[typeId].name,
            id: totalTagList[typeId].id,
            children: currentProject[typeId].map((tagID) => totalTagList[tagID]),
          }
          return type
        })
        //get first type tags
        const selectedTypeData = projectTotalTypes[0]
        const initialTypeID = projectTotalTagsParent[0]
        const selectedColumnOrder = currentProject[initialTypeID]
        const [selectedColumns, selectedTasks] = filterSelectedTypeTags(
          projectID,
          initialTypeID,
          totalTagList,
          totalTaskList,
          totalProjectList
        )
        const selectedTag = {
          selectedTypeData,
          selectedColumns,
          selectedTasks,
          selectedColumnOrder,
        }

        dispatch({ type: "tags/selectedProject", payload: projectID })
        dispatch({ type: "task/selectedProject", payload: projectID })
        dispatch({ type: "tags/getProjectTasks", payload: projectTaskDetail })
        dispatch({ type: "tags/getProjectInitialTypes", payload: projectTotalTypes })
        dispatch({ type: "tags/switchType", payload: selectedTag })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  switchType: function (selectedTypeID) {
    return async (dispatch, getState) => {
      try {
        const { totalTagList, totalProjectList, totalTaskList } = getState().projects
        const { selectedProjectID, types } = getState().tags
        const currentProject = totalProjectList[selectedProjectID]
        const selectedTypeData = types.find((type) => type.id === selectedTypeID)
        const selectedColumnOrder = currentProject[selectedTypeID]
        const [selectedColumns, selectedTasks] = filterSelectedTypeTags(
          selectedProjectID,
          selectedTypeID,
          totalTagList,
          totalTaskList,
          totalProjectList
        )
        const selectedTag = {
          selectedTypeData,
          selectedColumns,
          selectedTasks,
          selectedColumnOrder,
        }

        dispatch({ type: "tags/switchType", payload: selectedTag })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  updateTagOrder: function (taskTagContent) {
    return async (dispatch, getState) => {
      try {
        const { selectedProjectID } = getState().tags
        console.log(selectedProjectID)
        await firebase.saveTaskOrder(selectedProjectID, taskTagContent)
        dispatch({ type: "tags/switchTaskOrders", payload: taskTagContent })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  updateTagsForTask: function (taskContent) {
    return async (dispatch, getState) => {
      try {
        await firebase.saveTaskTags(taskContent)
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
}
