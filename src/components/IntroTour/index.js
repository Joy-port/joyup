import React from "react"
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride"
import { useDispatch, useSelector } from "react-redux"
import { TOUR_STEPS } from "../../helpers/introduction"

const index = () => {
  const tourStatus = useSelector((state) => state.tour)
  const dispatch = useDispatch()
  const tourActions = (data) => {
    const { action, index, type, status } = data
    console.log("click", data)
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && tourStatus.run) ||
      status === STATUS.FINISHED
    ) {
      dispatch({ type: "tour/STOP" })
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      dispatch({
        type: "tour/NEXT_OR_PREV",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
      })
    }
  }

  const startTour = () => {
    console.log("start")
    dispatch({ type: "tour/RESTART" })
  }

  return (
    <>
      <button className="button button-primary" onClick={startTour}>
        Start Tour
      </button>
      <JoyRide
        {...tourStatus}
        callback={tourActions}
        steps={TOUR_STEPS}
        continuous={true}
        showSkipButton={true}
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
          last: "End tour",
          skip: "Skip",
        }}
      />
    </>
  )
}

export default index
