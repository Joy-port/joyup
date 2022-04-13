import { useState, useCallback } from "react"

export const initialState = {
  text: "",
  query: null,
  slashCharacterPosition: null,
  selectionIndex: 0,
}

export function reducer(state, action) {
  switch (action.type) {
    case "editText":
      return { ...state, text: action.payload }
    case "editQuery":
      return { ...state, query: action.payload }
    case "selectionIndex":
      return { ...state, selectionIndex: action.payload }
    case "slashCharacterPosition":
      return { ...state, slashCharacterPosition: action.payload }
    default:
      return state
  }
}

export const useKeyPressCommand = (reducer, initState) => {
  const [state, setState] = useState(initState)
  const dispatch = useCallback(
    (action) => {
      const nextState = reducer(state, action)
      setState(nextState)
    },
    [setState, state]
  )

  return [state, dispatch]
}
