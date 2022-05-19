import React from "react"
import { useDispatch, useSelector } from "react-redux"

const Confirm = () => {
  const { openConfirm, confirmText, confirmActionText, action } = useSelector(
    (state) => state.status
  )
  const dispatch = useDispatch()

  return (
    <>
      {openConfirm && (
        <div className="modal-bg">
          <div
            style={{ zIndex: 10000 }}
            className={`modal-container bg-light000 modal-sm flex flex-col justify-center gap-8 items-center p-5 `}
          >
            <p className="text-lg capitalize px-5 text-center">{confirmText}</p>
            <div className="flex justify-between items-center gap-5 w-full px-12">
              <div
                className="button button-light300"
                onClick={() => {
                  dispatch({ type: "confirm/return", payload: false })
                }}
              >
                cancel
              </div>
              <div
                className="button button-primary"
                onClick={() => {
                  dispatch({ type: "confirm/return", payload: true })
                  action()
                }}
              >
                {confirmActionText}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Confirm
