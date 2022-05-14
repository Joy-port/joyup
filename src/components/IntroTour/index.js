import React from "react"
import JoyRide from "react-joyride"
import { TOUR_STEPS } from "../../helpers/introduction"

const index = () => {
  return (
    <JoyRide
      steps={TOUR_STEPS}
      continuous={true}
      showSkipButton={true}
      styles={{
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "green",
        },
        buttonBack: {
          marginRight: 10,
        },
      }}
      locale={{
        last: "End tour",
        skip: "Close tour",
      }}
    />
  )
}

export default index
