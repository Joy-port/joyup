import React from "react"
export const TOUR_STEPS = [
  {
    action: "next",
    title: "Guide Tour",
    target: "#createTaskButton",
    content: <p>Start This Project By Create a new Task</p>,
    placement: "center",
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
  {
    title: "Task Detail",
    target: "#createTaskButton",
    content: "This is where you can create or edit every tasks",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    hideFooter: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },

  {
    target: "#openClockButton",
    content: "View the cart you’ve added here",
  },
  {
    target: ".tour-contact",
    content: "Contact the developer",
  },
  {
    target: ".tour-policy",
    content: "We accept returns after 14 days max",
  },
]

//openClockButton
//createTaskButton
