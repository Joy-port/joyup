import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import "./assets/style/main.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import App from "./App"
import { store } from "./app/store"
import { Provider } from "react-redux"
import * as V from "victory"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)
