import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import "flowbite"
import "react-datepicker/dist/react-datepicker.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./assets/styles/main.css"
import "./assets/styles/helper.css"
import "./assets/styles/base.css"
import "./assets/styles/calendar.css"
import "./assets/styles/datepicker.css"
import "./assets/styles/scrollbar.css"
import App from "./App"
import { store } from "./app/store"
import { Provider } from "react-redux"

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
