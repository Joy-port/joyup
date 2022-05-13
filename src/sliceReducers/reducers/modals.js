const initialModalsState = {
  createProjectModalIsOpen: false,
}

function modalsReducer(state = initialModalsState, action) {
  switch (action.type) {
    case "modals/switchCreateProjectModal":
      return {
        createProjectModalIsOpen: action.payload,
      }
    default:
      return state
  }
}

export default modalsReducer
