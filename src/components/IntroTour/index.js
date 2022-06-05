import { Fragment, useState, useContext, useEffect } from "react"
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { steps } from "../../utils/introduction"
import { AuthContext } from "../AuthProvider"
import { v4 as uuidv4 } from "uuid"

const index = () => {
  const [userDetail] = useContext(AuthContext)
  const [runTour, setRunTour] = useState(false)
  const { createProjectModalIsOpen } = useSelector((state) => state.modals)
  const { isFirstTimeUser, tourStage } = useSelector((state) => state.user)
  const tourStatus = useSelector((state) => state.tour)
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const newTaskID = uuidv4()
  const runNextStepTour = (data, callback) => {
    const { action, index, type, status } = data
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && tourStatus.run) ||
      status === STATUS.FINISHED
    ) {
      if (action === "next" && status === "finished") {
        dispatch({ type: "tour/stop" })
        callback && callback()
      }
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      dispatch({
        type: "tour/toNextOrToPrevious",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
      })
    }
  }
  useEffect(() => {
    if (
      userDetail &&
      isFirstTimeUser &&
      pathname.includes("/projects") &&
      createProjectModalIsOpen === false
    ) {
      dispatch({ type: "tour/switchSteps", payload: steps.startTask })
      setRunTour(true)
    }
    return
  }, [createProjectModalIsOpen])

  useEffect(() => {
    if (!isFirstTimeUser && runTour) return
    if (pathname.includes("/tasks") && tourStage === 1) {
      dispatch({ type: "tour/switchSteps", payload: steps.introTask })
    } else if (pathname.includes("/clocks") && tourStage === 2) {
      dispatch({ type: "tour/switchSteps", payload: steps.introClock })
    }
    startTour()
  }, [pathname, runTour])

  const tourActions = (data) => {
    if (pathname.includes("/projects")) {
      runNextStepTour(data, () => {
        dispatch({ type: "task/createNewTask", payload: newTaskID })
        dispatch({ type: "tour/switchSteps", payload: steps.introTask })
        dispatch({ type: "user/setTourStage", payload: 1 })
        navigate(`/tasks/${newTaskID}`)
      })
    } else if (pathname.includes("tasks")) {
      runNextStepTour(data, () => {
        dispatch({ type: "tour/switchSteps", payload: steps.introClock })
        dispatch({ type: "user/setTourStage", payload: 2 })
        navigate(`/clocks/${newTaskID}`, { replace: true })
      })
    } else if (pathname.includes("clocks")) {
      runNextStepTour(data, () => {
        dispatch({ type: "tour/switchSteps", payload: steps.homePage })
        dispatch({ type: "user/setIsFirstTimeUser", payload: false })
        dispatch({ type: "user/setTourStage", payload: 3 })
        setRunTour(false)
        navigate(`/projects`)
      })
    }
  }

  const startTour = () => {
    if (!isFirstTimeUser) return
    dispatch({ type: "tour/restart" })
  }

  return (
    <Fragment>
      {isFirstTimeUser && runTour && (
        <JoyRide
          {...tourStatus}
          callback={tourActions}
          continuous={true}
          run={runTour}
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
              cursor: "default",
            },
            buttonSkip: {
              color: "#E3EDF2",
            },
            spotlightPadding: 5,
          }}
          locale={{
            last: "Next",
            skip: "Skip",
            next: "Next",
            back: "←",
          }}
        />
      )}
    </Fragment>
  )
}

export default index
