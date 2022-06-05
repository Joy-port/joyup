import { Fragment } from "react"
import * as Icon from "react-feather"
import { arrayOf, func, number, shape, string } from "prop-types"

const CommandList = ({
  commandList,
  onClickFunction,
  mouseSelectFunction,
  selectionIndex,
}) => {
  return (
    <Fragment>
      {commandList.length !== 0 && (
        <div className="results top-10 mt-1 z-10 ">
          {commandList.map((command, index) => {
            const IconName = Icon[command.icon]
            return (
              <div
                key={index}
                onClick={() => onClickFunction(command)}
                onMouseOver={() => mouseSelectFunction(index)}
                className={
                  "results__command " +
                  (index == selectionIndex ? "results__command--selected" : "")
                }
              >
                <IconName strokeWidth={1.5} />
                <p className="text-lg">{command.name}</p>
              </div>
            )
          })}
        </div>
      )}
    </Fragment>
  )
}

CommandList.propTypes = {
  commandList: arrayOf(
    shape({
      icon: string,
      name: string,
    })
  ),
  onClickFunction: func.isRequired,
  mouseSelectFunction: func.isRequired,
  selectionIndex: number.isRequired,
}

export default CommandList
