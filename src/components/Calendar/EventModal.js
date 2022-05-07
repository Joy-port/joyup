import React, { useCallback, useEffect, useState } from "react"
import { object, func, bool, string } from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import dayjs from "dayjs"
import { Maximize2, X } from "react-feather"
import { useNavigate } from "react-router-dom"
import { task } from "../../sliceReducers/actions/task"

const EventModal = ({ type, position, setIsOpenModal, isOpenModal }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const taskDetail = useSelector((state) => state.task)
  let left = 0
  let top = 0
  if (JSON.stringify(position) !== "{}") {
    if (type === "click") {
      if (position.clientX - 176 < 0) {
        left = 0
      } else if (position.clientX + 240 > 700) {
        left = 460
      } else {
        left = position.clientX - 176
      }
      if (position.clientY + 128 > 750) {
        top = 380
      } else {
        top = position.clientY - 66
      }
    } else {
      left = (position.left + position.right - position.x) / 2
      top = (position.top + position.bottom - position.y) / 2
    }
  }
  return (
    <>
      {JSON.stringify(taskDetail) !== "{}" && (
        <div
          className={`modal-container-popUp hide text-light300 z-110 ${
            isOpenModal ? "" : "hidden"
          }`}
          style={{ left, top }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold ">{taskDetail.title}</div>
            <div
              className="show cursor-pointer"
              onClick={() => {
                if (confirm("quite without saving?")) {
                  dispatch(task.deleteCurrentTask())
                  dispatch({ type: "task/clearTaskWithoutSaving" })
                  setIsOpenModal(false)
                }
              }}
            >
              <X />
            </div>
          </div>
          <div className="">
            Start : {dayjs(new Date(taskDetail.startDate)).format("MMM DD, HH:MM")}
          </div>
          <div className="">
            Due : {dayjs(new Date(taskDetail.dueDate)).format("MMM DD, HH:MM")}
          </div>
          <div
            className="button button-dark ml-auto cursor-pointer w-10"
            onClick={() => {
              setIsOpenModal(false)
              navigate(`/task/${taskDetail.id}`)
            }}
          >
            <Maximize2 size={20} />
          </div>
        </div>
      )}
    </>
  )
}

EventModal.propTypes = {
  type: string.isRequired,
  position: object.isRequired,
  setIsOpenModal: func.isRequired,
  isOpenModal: bool.isRequired,
}

export default EventModal
