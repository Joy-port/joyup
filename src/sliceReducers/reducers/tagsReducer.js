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
    case "tags/getProjectInitialTypes":
      return {
        ...state,
        types: [...action.payload],
        // selectedType: { ...initialTypeData },
        // selectedTagColumns: { ...selectedColumns },
        // selectedTagTasks: selectedTasks,
        // selectedColumnOrder: [...selectedColumnOrder],
        // noneTagTasks: noneTask,
      }
    case "tags/switchType":
      const { selectedTypeData, selectedColumns, selectedTasks, selectedColumnOrder } =
        action.payload
      return {
        ...state,
        selectedType: { ...selectedTypeData },
        selectedTagColumns: { ...selectedColumns },
        selectedTagTasks: selectedTasks,
        selectedColumnOrder: [...selectedColumnOrder],
        // noneTagTasks: noneGroupTask,
      }
    case "switchProject":
      const { pid } = action.payload
      return { ...state, selectedProjectID: pid }
    case "getProjectTasks":
      const selectedProjectID = "8gx8UcCs8cLC8V8s2SMK"
      // const allTasks = await firebase.getProjectTasks(selectedProjectID)
      return { ...state, selectedTagTasks: allTasks }
    case "tags/switchTaskOrders":
      const columnContent = { ...action.payload }
      const { selectedTagColumns } = state
      selectedTagColumns[columnContent.id].taskIds = [...columnContent.taskIds]
      console.log(selectedTagColumns)
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
