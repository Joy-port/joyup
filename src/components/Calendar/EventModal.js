import React, { useCallback, useEffect, useState } from "react"
import { object, func, bool, string } from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import dayjs from "dayjs"
import { Edit3, X } from "react-feather"
import { useNavigate } from "react-router-dom"
import { task } from "../../sliceReducers/actions/task"
import { status } from "../../sliceReducers/actions/status"

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
        left = `calc(${position.clientX} - 176px)`
      }
      if (position.clientY + 128 > 750) {
        // top = "calc(100% - 5%)"
        top = ((position.top + position.bottom - position.y) * 5) / 100
      } else {
        // top = `calc(${position.clientY} - 2%)`
        top = ((position.top + position.bottom - position.y) * 10) / 100
      }
    } else {
      if (position.clientX - 200 < 0) {
        left = 0
      } else if (position.clientX + 240 > 700) {
        left = 460
      } else {
        // left = `calc(${position.clientX} - 176px)`
        left = (position.left + position.right - position.x) / 2
      }
      if (position.clientY < 200) {
        top = ((position.top + position.bottom - position.y) * 120) / 100
      } else if (position.clientY + 128 > 750) {
        // top = "calc(100% - 5%)"
        top = ((position.top + position.bottom - position.y) * 56) / 100
      } else {
        // top = `calc(${position.clientY} - 2%)`
        top = ((position.top + position.bottom - position.y) * 40) / 100
      }
      // left = (position.left + position.right - position.x) / 2
      // top = ((position.top + position.bottom - position.y) * 56) / 100
    }
  }
  return (
    <>
      {JSON.stringify(taskDetail) !== "{}" && (
        <div
          className={`modal-container-popUp h-32 w-54 text-light300 z-110 ${
            isOpenModal ? "" : "hidden"
          }`}
          style={{ left, top }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold ">{taskDetail.title}</div>
            <div
              className="hover:text-transparentDark cursor-pointer"
              onClick={() => {
                // const confirmText = {
                //   context: "Do you want to quit without saving?",
                //   confirm: "yes",
                //   action: () => {
                //     dispatch(task.deleteCurrentTask())
                //     dispatch({ type: "task/clearTaskWithoutSaving" })
                //     setIsOpenModal(false)
                //   },
                // }
                // dispatch(status.openConfirmModal(confirmText))
                // () => {
                //     dispatch(task.deleteCurrentTask())
                //     dispatch({ type: "task/clearTaskWithoutSaving" })
                //     setIsOpenModal(false)
                // if (confirm("quite without saving?")) {
                dispatch(task.deleteCurrentTask())
                dispatch({ type: "task/clearTaskWithoutSaving" })
                setIsOpenModal(false)
                // }
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
              navigate(`/tasks/${taskDetail.id}`)
            }}
          >
            <Edit3 size={20} />
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
