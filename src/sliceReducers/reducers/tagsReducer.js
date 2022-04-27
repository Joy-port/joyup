const initialTagState = {
  selectedProjectID: "",
  types: [],
  selectedType: {},
  selectedTagColumns: {},
  selectedTagTasks: [],
  noneTagTasks: [],
  selectedColumnOrder: [],
  selectedProjectTagsOrderList: {},
  selectedProjectTaskList: {},
}

function tagsReducer(state = initialTagState, action) {
  switch (action.type) {
    case "tags/selectedProject":
      return {
        ...state,
        selectedProjectID: action.payload,
      }
    case "tags/getProjectTasks":
      return {
        ...state,
        selectedProjectTaskList: { ...action.payload },
      }
    case "tags/getProjectInitialTags":
      const {
        projectTotalTypes,
        initialTypeData,
        selectedColumns,
        selectedTasks,
        selectedColumnOrder,
      } = action.payload
      console.log(selectedColumnOrder)
      return {
        ...state,
        types: [...projectTotalTypes],
        selectedType: { ...initialTypeData },
        selectedTagColumns: { ...selectedColumns },
        selectedTagTasks: selectedTasks,
        selectedColumnOrder: [...selectedColumnOrder],
        // noneTagTasks: noneTask,
        // selectedProjectTagsOrderList: projectTagContent,
      }
    // case "getTags":
    //   return { ...state, [type]: date }
    case "getInitialTags":
      // disconnect to firebase
      // const defaultTagList = initialTotalTags
      // const totalProjects = initialTasks
      // connect to firebase
      // const projectID = "8gx8UcCs8cLC8V8s2SMK"
      // const totalProjectTasks = await firebase.getProjectTasks(projectID)
      // const defaultTagList = await firebase.getDefaultTags(projectID)
      // const projectTagContent = await firebase.getProjectTags(projectID)

      const newTagList = [...defaultTagList]
      const newSelectedType = newTagList[0]
      const newColumns = {}
      const [selectedTask, noneTask] = separateTasks(
        totalProjectTasks,
        newSelectedType.id
      )
      newSelectedType.children.map((tagChild) => {
        const currentTagTaskIds = matchTagTaskIds(tagChild.id, projectTagContent)
        newColumns[tagChild.id] = {
          id: tagChild.id,
          title: tagChild.name,
          taskIds: [...currentTagTaskIds],
        }
      })
      const newColumnOrder = Object.keys(newColumns)

      return {
        ...state,
        types: newTagList,
        selectedType: newSelectedType,
        selectedTagColumns: newColumns,
        selectedColumnOrder: newColumnOrder,
        totalTagTasks: totalProjectTasks,
        selectedTagTasks: selectedTask,
        noneTagTasks: noneTask,
        selectedProjectTagsOrderList: projectTagContent,
      }
    case "switchType":
      const typeId = action.payload
      const totalTasks = [...state.selectedTagTasks]
      const newType = state.types.find((type) => typeId === type.id)
      const [selectedTypeTask, noneGroupTask] = separateTasks(totalTasks, newType.id)

      let newTagsColumns = {}
      newType.children.forEach((tag) => {
        const newTypeTaskIds = matchTagTaskIds(tag.id, state.selectedProjectTagsOrderList)
        newTagsColumns[tag.id] = {
          id: tag.id,
          title: tag.name,
          taskIds: newTypeTaskIds,
        }
      })
      const newOrder = Object.keys(newTagsColumns)
      return {
        ...state,
        selectedType: { ...newType },
        selectedTagColumns: { ...newTagsColumns },
        selectedColumnOrder: [...newOrder],
        selectedTagTasks: selectedTypeTask,
        noneTagTasks: noneGroupTask,
      }
    case "switchProject":
      const { pid } = action.payload
      return { ...state, selectedProjectID: pid }
    case "getProjectTasks":
      const selectedProjectID = "8gx8UcCs8cLC8V8s2SMK"
      // const allTasks = await firebase.getProjectTasks(selectedProjectID)
      return { ...state, selectedTagTasks: allTasks }
    case "switchTagForTask":
      const columnContent = { ...action.payload }
      const { selectedTagColumns } = state
      selectedTagColumns[columnContent.id] = columnContent
      firebase.saveTaskOrder(state.projectID, columnContent)
      return { ...state, selectedTagColumns }
    case "removeTag":
      const [removedTaskID, removedTagId] = action.payload
      const newNoTagList = state.noneGroupTask.push(
        state.selectedTagTasks.find((item) => item.id === removedTaskID)
      )
      const newSelectedList = state.selectedTagTasks.filter(
        (item) => item.id !== removedTagId
      )
      return {
        ...state,
        selectedTagColumns: newSelectedList,
        noneGroupTask: newNoTagList,
      }
    case "getAllProjects":
      // const totalProjects = await firebase.getTotalProjects()
      return { ...state, totalProjectList: [...totalProjects] }
    case "getProjectList":
      const { userID } = action.payload
      // const [ownerProjects, collaborateProjects] = await firebase.getUserProjects(userID)
      // projectList: projects, currentProjectID: projects[0]
      // console.log(ownerProjects)
      console.log(ownerProjects, collaborateProjects)
      return {
        ...state,
        ownerProjectList: [...ownerProjects],
        collaborateProjectList: [...collaborateProjects],
      }
    // case "switchProject":
    //   return { ...state, currentProjectID: action.payload }
    default:
      return state
  }
}

export default tagsReducer
