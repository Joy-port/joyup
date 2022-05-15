import React from "react"
export const steps = {
  startTask: [
    {
      title: "Start to Concentrate",
      target: "#openClockButton",
      content: <p>Click here to select a existing task and start to focus</p>,
    },
    {
      title: "New Task",
      target: "#createTaskButton",
      content: <p>Before focusing, {`let's`} create a new task!</p>,
    },
  ],
  introTask: [
    {
      title: "Edit Title or Other Settings",
      target: "#taskEditorTitle",
      content: <p>Enter title or click {"/"} slash for more settings</p>,
      disableBeacon: false,
    },
    {
      title: "Change Tags",
      target: "#taskEditorTags",
      content: <p>Click on the right button to switch between your projects / tags</p>,
    },
    {
      title: "Date Settings",
      target: "#taskEditorDate",
      content: (
        <>
          <p>1. Choose Date by switching all day button</p>
          <p>2. Click on the date to change start/due date</p>
        </>
      ),
    },
    {
      title: "Focusing Settings",
      target: "#taskEditorClock",
      content: (
        <>
          <p>1. Click on the right button for setting up your Pomodoro Timer!</p>
          <p>2. Click Play to Start!</p>
        </>
      ),
    },
    {
      title: "Start to Concentrate",
      target: "#taskEditorPressClock",
      content: <p>Press on the play button to open timer and start to focus</p>,
    },
  ],
  introClock: [
    {
      title: "Start to Focus",
      target: "#clockControlButton",
      content: <p>Press the button to play or pause the timer</p>,
      disableBeacon: true,
    },
    {
      title: "Back to Task",
      target: "#clockControlBackToTask",
      content: <p>Click here to back to the task</p>,
    },
    {
      title: "Ready? Let's Start!",
      target: "#clockControlBackToTask",
      content: <p>If you are ready than start and set up your task!</p>,
      placement: "center",
      locale: { next: "Start My Task" },
    },
  ],
  // startClock: [],
  // homePage: [
  //   {
  //     title: "Home Page",
  //     target: "#Home",
  //     content: <p>Click on the side bar menu to home page and browse the tasks </p>,
  //   },
  //   {
  //     title: "Home Page",
  //     target: "#Reports",
  //     content: <p>Click on the side bar menu to home page and browse the tasks </p>,
  //   },
  //   {
  //     title: "Projects Page",
  //     target: "#Projects",
  //     content: <p>Click on the side bar menu to Browse all the projects</p>,
  //   },
  //   {
  //     title: "Start to Concentrate",
  //     target: "#openClockButton",
  //     content: <p>Click here to select existed tasks and start to concentrate</p>,
  //   },
  // ],
}
