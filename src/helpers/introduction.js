import React from "react"
export const steps = {
  startTask: [
    {
      title: "Home Page",
      target: "#Home",
      content: <p>Click on the side bar menu to home page and browse the tasks </p>,
    },
    {
      title: "Projects Page",
      target: "#Projects",
      content: <p>Click on the side bar menu to Browse all the projects</p>,
    },
    {
      title: "Start to Concentrate",
      target: "#openClockButton",
      content: <p>Click here to select existed tasks and start to concentrate</p>,
    },
    {
      title: "New Task",
      target: "#createTaskButton",
      content: (
        <>
          <p>Click this Button to Create a new Task</p>
        </>
      ),
      // disableBeacon: true,
      // disableOverlayClose: true,
      // hideCloseButton: true,
      // hideFooter: true,
    },
  ],
  introTask: [
    {
      title: "Edit Title or Other Settings",
      target: "#taskEditorTitle",
      content: <p>Enter task title or click {"/"} slash for more settings</p>,
    },
    {
      title: "Edit Styling with Slash Command",
      target: "#taskEditorDescription",
      content: <p>Enter task title or click {"/"} slash for more settings</p>,
    },
    {
      title: "Switch from Projects",
      target: "#taskEditorProject",
      content: <p>Enter task title or click {"/"} slash for more settings</p>,
    },
    {
      title: "Start to Concentrate",
      target: "#taskEditorpriority",
      content: <p>Enter task title or click {"/"} slash for more settings</p>,
    },
    {
      title: "Start to Concentrate",
      target: "#taskEditorprogress",
      content: <p>Enter task title or click {"/"} slash for more settings</p>,
    },
    {
      title: "Start to Concentrate",
      target: "#taskEditorDate",
      content: <p>Enter task title or click {"/"} slash for more settings</p>,
    },
    {
      title: "Start to Concentrate",
      target: "#taskEditorClock",
      content: <p>Enter task title or click {"/"} slash for more settings</p>,
    },
    {
      title: "Start to Concentrate",
      target: "#taskEditorPressClock",
      content: <p>Press here to Open Timer and start to concentrate</p>,
    },
  ],
  introClock: [
    {
      title: "Start to Concentrate",
      target: "#clockControlButton",
      content: <p>Press here and start to concentrate</p>,
    },
    {
      title: "Start to Concentrate",
      target: "#clockControlBackToTask",
      content: <p>Press here to Open Timer and start to concentrate</p>,
    },
  ],
  startClock: [],
  homePage: [
    {
      title: "Home Page",
      target: "#Home",
      content: <p>Click on the side bar menu to home page and browse the tasks </p>,
    },
    {
      title: "Projects Page",
      target: "#Projects",
      content: <p>Click on the side bar menu to Browse all the projects</p>,
    },
    {
      title: "Start to Concentrate",
      target: "#openClockButton",
      content: <p>Click here to select existed tasks and start to concentrate</p>,
    },
  ],
}

//openClockButton
//createTaskButton
