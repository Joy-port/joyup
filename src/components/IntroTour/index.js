import React, { useCallback, useContext, useEffect } from "react"
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { steps } from "../../helpers/introduction"
import { AuthContext } from "../AuthProvider"
import { v4 as uuidv4 } from "uuid"

const index = () => {
  const [userDetail, loading, error] = useContext(AuthContext)
  const { createProjectModalIsOpen } = useSelector((state) => state.modals)
  const { isFirstTimeUser } = useSelector((state) => state.user)
  const tourStatus = useSelector((state) => state.tour)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const newTaskID = uuidv4()
  const runNextStepTour = (data, callback) => {
    const { action, index, type, status } = data
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && tourStatus.run) ||
      status === STATUS.FINISHED
    ) {
      if (action === "next" && status === "finished") {
        callback && callback()
      }
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      dispatch({
        type: "tour/NEXT_OR_PREV",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
      })
    }
  }
  useEffect(() => {
    if (
      userDetail &&
      isFirstTimeUser &&
      pathname.includes("/projects") &&
      !createProjectModalIsOpen
    ) {
      dispatch({ type: "tour/SWITCH_STEPS", payload: steps.startTask })
      dispatch({ type: "tour/setIntroSteps", payload: 2 })
      startTour()
    }
    return
  }, [createProjectModalIsOpen])

  useEffect(() => {
    if (pathname.includes("/projects")) {
      //   if (introSteps === 1) {
      console.log("check if start after create project")
      // startTour()
      //   }
    } else if (pathname.includes("/tasks")) {
      dispatch({ type: "tour/SWITCH_STEPS", payload: steps.introTask })
      startTour()
    } else if (pathname.includes("/clocks")) {
      dispatch({ type: "tour/SWITCH_STEPS", payload: steps.introClock })
      startTour()
    }
  }, [pathname])

  const tourActions = (data) => {
    const { action, index, type, status } = data
    if (pathname.includes("/projects")) {
      runNextStepTour(data, () => {
        dispatch({ type: "tour/STOP" })
        dispatch({ type: "task/createNewTask", payload: newTaskID })
        dispatch({ type: "tour/SWITCH_STEPS", payload: steps.introTask })
        navigate(`/tasks/${newTaskID}`)
      })
    } else if (pathname.includes("tasks")) {
      runNextStepTour(data, () => {
        dispatch({ type: "tour/STOP" })
        dispatch({ type: "tour/SWITCH_STEPS", payload: steps.introClock })
        navigate(`/clocks/${newTaskID}`)
      })
    } else if (pathname.includes("clocks")) {
      runNextStepTour(data, () => {
        dispatch({ type: "tour/STOP" })
        dispatch({ type: "tour/SWITCH_STEPS", payload: steps.homePage })
        dispatch({ type: "user/setIsFirstTimeUser", payload: false })
        navigate(`/projects`)
      })
    }
  }

  const startTour = () => {
    if (!isFirstTimeUser) return
    dispatch({ type: "tour/RESTART" })
  }

  return (
    <>
      <button
        className="button button-primary"
        onClick={startTour}
        style={{ zIndex: 1000000, position: "fixed" }}
      >
        Start Tour
      </button>
      <JoyRide
        {...tourStatus}
        callback={tourActions}
        // steps={steps.introTask}
        continuous={true}
        // showSkipButton={true}
        // showProgress={true}
        styles={{
          tooltipContainer: {
            textAlign: "left",
          },
          buttonNext: {
            backgroundColor: "#669FBA",
          },
          buttonBack: {
            color: "#E3EDF2",
            marginRight: 10,
          },
          buttonSkip: {
            color: "#E3EDF2",
          },
        }}
        locale={{
          last: "Next",
          skip: "Skip",
          next: "Next",
        }}
      />
    </>
  )
}

export default index
