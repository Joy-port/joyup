const initialTagState = {
  selectedProjectID: "",
  types: [],
  selectedType: {},
  selectedTagColumns: {},
  selectedTagTasks: [],
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
      }
    case "tags/switchTaskOrders":
      const columnContent = { ...action.payload }
      const { selectedTagColumns } = state
      selectedTagColumns[columnContent.id].taskIds = [...columnContent.taskIds]
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
    case "tags/clearTagsData":
      return {
        ...JSON.parse(JSON.stringify(initialTagState)),
      }
    default:
      return state
  }
}

export default tagsReducer
