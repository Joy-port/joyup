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
      title: totalTagList[tagID],
      taskIds: currentProject[tagID],
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
  switchProject: function (projectID) {
    return async (dispatch, getState) => {
      try {
        const { totalTagList, totalProjectList, totalTaskList } = getState().projects
        const currentProject = totalProjectList[projectID]
        const projectTasks = currentProject.tasks
        const projectTaskDetail = {}
        projectTasks.forEach((taskID) => {
          projectTaskDetail[taskID] = {
            title: totalTaskList[taskID].title,
            id: totalTaskList[taskID].id,
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
        const initialTypeData = projectTotalTypes[0]
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
          projectTotalTypes,
          initialTypeData,
          selectedColumns,
          selectedTasks,
          selectedColumnOrder,
        }

        dispatch({ type: "tags/selectedProject", payload: projectID })
        dispatch({ type: "task/selectedProject", payload: projectID })
        dispatch({ type: "tags/getProjectTasks", payload: projectTaskDetail })
        dispatch({ type: "tags/getProjectInitialTags", payload: selectedTag })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
}
