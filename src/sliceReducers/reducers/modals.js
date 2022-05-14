const initialModalsState = {
  createProjectModalIsOpen: false,
  taskClockSettingModalIsOpen: false,
}

function modalsReducer(state = initialModalsState, action) {
  switch (action.type) {
    case "modals/switchCreateProjectModal":
      return {
        createProjectModalIsOpen: action.payload,
      }
    case "modals/switchTaskClockSettingModal":
      return {
        taskClockSettingModalIsOpen: action.payload,
      }
    default:
      return state
  }
}

export default modalsReducer
