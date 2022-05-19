import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter as Router } from "react-router-dom"
import { store } from "./store"
import App from "./App"
import "react-datepicker/dist/react-datepicker.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./assets/styles/main.css"
import "./assets/styles/components.scss"

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
