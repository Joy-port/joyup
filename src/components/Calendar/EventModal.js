import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Edit3, X } from "react-feather"
import { object, func, bool, string } from "prop-types"
import moment from "moment"
import { task } from "../../store/actions/task"

const EventModal = ({ type, position, setIsOpenModal, isOpenModal }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const taskDetail = useSelector((state) => state.task)
  let left = 0
  let top = 0
  if (JSON.stringify(position) !== "{}") {
    if (type === "click") {
      if (position.clientX - 200 < 0) {
        left = 0
      } else if (position.clientX + 240 > 700) {
        left = 460
      } else {
        left = position.clientX - 176
      }
      if (position.clientY + 128 > 700) {
        top = position.clientY - 250
      } else {
        top = position.clientY - 50
      }
    } else {
      left = (position.left + position.right - position.x) / 2 + 50
      top = ((position.top + position.bottom - position.y) * 56) / 100
      if (position.x - 200 < 0) {
        left = 0
      } else if (position.x + 240 > 700) {
        left = left - 80
      } else {
        left += 100
      }
      if (position.y < 200) {
        top = position.top
      } else if (position.y + 128 > 700) {
        top = position.top - 100
      } else {
        top = top
      }
    }
  }
  return (
    <Fragment>
      {JSON.stringify(taskDetail) !== "{}" && (
        <div
          className={`modal-container-popUp h-32 w-54 text-light300 z-110 cursor-pointer ${
            isOpenModal ? "" : "hidden"
          }`}
          style={{ left, top }}
        >
          <div
            className="flex justify-between items-center mb-2 cursor-pointer "
            onClick={() => {
              setIsOpenModal(false)
              navigate(`/tasks/${taskDetail.id}`)
            }}
          >
            <div className="text-lg font-semibold ">{taskDetail.title}</div>
            <div
              className="hover:text-transparentDark cursor-pointer"
              onClick={() => {
                dispatch(task.deleteCurrentTask())
                dispatch({ type: "task/clearTaskWithoutSaving" })
                setIsOpenModal(false)
              }}
            >
              <X />
            </div>
          </div>
          <div
            onClick={() => {
              setIsOpenModal(false)
              navigate(`/tasks/${taskDetail.id}`)
            }}
          >
            Start : {moment(new Date(taskDetail.startDate)).format("MMM DD, HH:mm")}
          </div>
          <div
            onClick={() => {
              setIsOpenModal(false)
              navigate(`/tasks/${taskDetail.id}`)
            }}
          >
            Due : {moment(new Date(taskDetail.dueDate)).format("MMM DD, HH:mm")}
          </div>
          <div
            className="button button-dark ml-auto cursor-pointer w-10"
            onClick={() => {
              setIsOpenModal(false)
              navigate(`/tasks/${taskDetail.id}`)
            }}
          >
            <Edit3 size={20} />
          </div>
        </div>
      )}
    </Fragment>
  )
}

EventModal.propTypes = {
  type: string.isRequired,
  position: object.isRequired,
  setIsOpenModal: func.isRequired,
  isOpenModal: bool.isRequired,
}

export default EventModal
