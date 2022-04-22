import React, { useState } from "react"

export function useAsyncReducer(reducer, initialState) {
  const [state, setState] = useState(initialState),
    dispatchState = async (action) => setState(await reducer(state, action))
  return [state, dispatchState]
}

// async function reducer(state, action) {
//   switch (action.type) {
//     case "switch1":
//       // Do async code here
//       return "newState"
//   }
// }

// function App() {
//   const [state, dispatchState] = useAsyncReducer(reducer, "initState")
//   return <ExampleComponent dispatchState={dispatchState} />
// }

// function ExampleComponent({ dispatchState }) {
//   return <button onClick={() => dispatchState({ type: "switch1" })}>button</button>
// }
