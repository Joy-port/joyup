import React, { useState, useRef, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as Icon from "react-feather"
import { task } from "../../../store/actions/task"
import { titleCommandList, dateCommandList } from "../../../utils/slashCommands"
import { filterCommandListByQuery } from "../../../utils/helpers"

const TitleEditor = () => {
  const clearCommands = {
    query: null,
    slashCharacterPosition: null,
  }
  const { title } = useSelector((state) => state.task)
  const { types } = useSelector((state) => state.tags)
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(true)
  const [text, setText] = useState(title)
  const [totalCommands, setTotalCommands] = useState({ ...clearCommands })
  const [timeCommands, setTimeCommands] = useState({ ...clearCommands })
  const [tagCommands, setTagCommands] = useState({ ...clearCommands })
  const [selectedTagType, setSelectedTagType] = useState(null)
  const [dateType, setDateType] = useState(null)
  const [selectionIndex, setSelectionIndex] = useState(0)
  const [style, setStyle] = useState("heading-three font-semibold")
  const inputRef = useRef()
  const titleRef = useRef()
  const deleteSlash = (deleteFromPosition, slashPosition) => {
    setText((text) => {
      const string =
        text.substring(deleteFromPosition, slashPosition) +
        text.substring(inputRef.current?.selectionStart)
      return string
    })
  }
  const addSlash = (deleteFromPosition, slashPosition) => {
    setText((text) => {
      const string = text.substring(deleteFromPosition, slashPosition) + "/"
      return string
    })
  }
  const clearExistingCommands = () => {
    if (totalCommands.slashCharacterPosition !== null) {
      deleteSlash(0, totalCommands.slashCharacterPosition)
    } else if (tagCommands.slashCharacterPosition !== null) {
      deleteSlash(0, tagCommands.previousCharacterPosition)
    } else if (timeCommands.slashCharacterPosition !== null) {
      deleteSlash(0, timeCommands.previousCharacterPosition)
    }
    setTotalCommands({ ...clearCommands })
    setTimeCommands({ ...clearCommands })
    setTagCommands({ ...clearCommands })
    setSelectionIndex(0)
    setIsEditing(false)
  }
  const editTimeSettingCommand = useCallback(() => {
    deleteSlash(0, timeCommands.previousCharacterPosition)
    setDateType(null)
    setTimeCommands({
      ...clearCommands,
    })
    setSelectionIndex(0)
    setStyle("heading-three font-semibold")
    setIsEditing(true)
    inputRef.current.focus()
  })

  useEffect(() => {
    if (
      totalCommands.slashCharacterPosition === null &&
      timeCommands.slashCharacterPosition === null &&
      tagCommands.slashCharacterPosition === null
    ) {
      titleRef.current = text
      dispatch(task.saveTaskDetail("title", text))
    }
    setIsEditing(true)
  }, [text])

  const getMatchingCommands = (queryContent, commandList) => {
    if (queryContent !== null) {
      return filterCommandListByQuery(queryContent, commandList)
    } else {
      return []
    }
  }
  const matchingCommands = getMatchingCommands(totalCommands.query, titleCommandList)
  const matchingTags = getMatchingCommands(tagCommands.query, selectedTagType?.children)
  const matchingTimeSettings = getMatchingCommands(timeCommands.query, dateCommandList)

  useEffect(() => {
    if (
      matchingCommands.length !== 0 &&
      matchingTags.length !== 0 &&
      matchingTimeSettings.length !== 0
    ) {
      setStyle("heading-three font-semibold")
    }
  }, [matchingCommands, matchingTags, matchingTimeSettings])

  const getFirstLayerQueryCommandContents = (inputTextContent) => {
    const newText = inputTextContent
    setText(newText)
    if (totalCommands.slashCharacterPosition !== null) {
      const isSlashStillActive = newText[totalCommands.slashCharacterPosition] === "/"
      if (isSlashStillActive) {
        setTotalCommands((prev) => {
          return {
            ...prev,
            query: newText.substring(
              prev.slashCharacterPosition + 1,
              inputRef.current?.selectionStart
            ),
          }
        })
        setSelectionIndex(0)
      } else {
        setTotalCommands({
          ...clearCommands,
        })
      }
    } else if (tagCommands.slashCharacterPosition !== null) {
      const isSlashStillActive = newText[tagCommands.slashCharacterPosition] === ":"
      if (isSlashStillActive) {
        setTagCommands((prev) => {
          return {
            ...prev,
            query: newText.substring(
              tagCommands.slashCharacterPosition + 1,
              inputRef.current?.selectionStart
            ),
          }
        })
        setSelectionIndex(0)
      } else {
        setTagCommands({
          ...clearCommands,
        })
      }
    } else if (timeCommands.slashCharacterPosition !== null) {
      const isSlashStillActive = newText[timeCommands.slashCharacterPosition - 1] === ":"
      if (isSlashStillActive) {
        setTimeCommands((prev) => {
          return {
            ...prev,
            query: newText.substring(
              timeCommands.slashCharacterPosition,
              inputRef.current?.selectionStart
            ),
          }
        })
        setSelectionIndex(0)
      }
    } else {
      setTimeCommands({
        ...clearCommands,
      })
    }
  }

  const selectTotalCommand = (command) => {
    setIsEditing(true)
    const slashCharacterPosition =
      inputRef.current?.selectionStart +
      command.name.length +
      command.name.split(" ").length -
      1
    if (command.type === "tag") {
      setTagCommands({
        query: "",
        slashCharacterPosition,
        previousCharacterPosition: totalCommands.slashCharacterPosition,
      })
    } else {
      setTimeCommands({
        query: "",
        slashCharacterPosition,
        previousCharacterPosition: totalCommands.slashCharacterPosition,
      })
    }
    setText(() => {
      const newText = titleRef.current + `/${command.name}:`
      return newText
    })

    setStyle("heading-three font-semibold text-light200")
    setTotalCommands({ ...clearCommands })
    if (command.type === "tag") {
      setSelectedTagType(types.find((item) => item.type === command.name))
    } else {
      setDateType(command.type)
    }
    setSelectionIndex(0)
  }

  const selectTimeCommand = (command) => {
    const date = command.date
    const dateContent = { name: dateType, date }
    dispatch(task.saveTaskDate(dateContent))
    editTimeSettingCommand()
  }

  const selectTags = (child) => {
    const tagType = {
      parent: selectedTagType.id,
      child: child.id,
      type: selectedTagType.type,
    }
    dispatch(task.saveTaskTag(tagType))
    setSelectedTagType(null)
    deleteSlash(0, tagCommands.previousCharacterPosition)
    setStyle("heading-three")
    setSelectionIndex(0)
    setTagCommands((prev) => {
      return {
        ...prev,
        query: null,
      }
    })
    setIsEditing(true)
    inputRef.current.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      if (
        totalCommands.slashCharacterPosition !== null ||
        tagCommands.slashCharacterPosition !== null ||
        timeCommands.slashCharacterPosition !== null
      ) {
        setSelectionIndex((prevIndex) => Math.max(0, prevIndex - 1))
      }
      e.stopPropagation()
      e.preventDefault()
      return
    } else if (e.key === "ArrowDown") {
      if (totalCommands.slashCharacterPosition !== null) {
        setSelectionIndex((prevIndex) =>
          Math.min(matchingCommands.length - 1, prevIndex + 1)
        )
      } else if (tagCommands.slashCharacterPosition !== null) {
        setSelectionIndex((prevIndex) => Math.min(matchingTags.length - 1, prevIndex + 1))
      } else if (timeCommands.slashCharacterPosition !== null) {
        setSelectionIndex((prevIndex) =>
          Math.min(matchingTimeSettings.length - 1, prevIndex + 1)
        )
      }
      e.stopPropagation()
      e.preventDefault()
      return
    } else if (e.key === "Enter") {
      if (matchingCommands[selectionIndex]) {
        selectTotalCommand(matchingCommands[selectionIndex])
        return
      }
      if (matchingTags[selectionIndex]) {
        selectTags(matchingTags[selectionIndex])
        return
      }
      if (matchingTimeSettings[selectionIndex]) {
        selectTimeCommand(matchingTimeSettings[selectionIndex])
        return
      }
      if (totalCommands.slashCharacterPosition === null && selectedTagType === null) {
        e.stopPropagation()
        e.preventDefault()
        if (text.trim() === "") return
        titleRef.current = text
        dispatch(task.saveTaskDetail("title", text))
        return
      }
    } else if (e.key === "/") {
      setTotalCommands((prev) => {
        return { ...prev, slashCharacterPosition: inputRef.current?.selectionStart }
      })
      setIsEditing(true)
    } else if (e.key === "Backspace") {
      if (!text.includes("/") && !text.includes(":")) {
        setTotalCommands({ ...clearCommands })
        setTagCommands({ ...clearCommands })
        setTimeCommands({ ...clearCommands })
        return
      }
      if (timeCommands.slashCharacterPosition && text.endsWith(":")) {
        e.preventDefault()
        setTotalCommands((prev) => {
          return {
            ...prev,
            slashCharacterPosition: timeCommands.previousCharacterPosition,
          }
        })
        addSlash(0, timeCommands.previousCharacterPosition)
        setTimeCommands({ ...clearCommands })
        setTotalCommands((prev) => {
          return {
            ...prev,
            query: "",
          }
        })
        setDateType(null)
        setSelectionIndex(0)
      } else if (tagCommands.slashCharacterPosition && text.endsWith(":")) {
        e.preventDefault()
        setTotalCommands((prev) => {
          return {
            ...prev,
            slashCharacterPosition: tagCommands.previousCharacterPosition,
          }
        })
        addSlash(0, tagCommands.previousCharacterPosition)
        setTagCommands({ ...clearCommands })
        setTotalCommands((prev) => {
          return {
            ...prev,
            query: "",
          }
        })
        setDateType(null)
        setSelectionIndex(0)
      }
    }
  }
  return (
    <div className="flex flex-col rounded relative w-full">
      {text !== "" && !isEditing ? (
        <div
          className="heading-three font-semibold text-light300 px-2 py-1 rounded bg-white"
          onClick={() => {
            setIsEditing(true)
            setText(text)
          }}
        >
          {text}
        </div>
      ) : (
        <input
          className={`rounded heading-three input-light300 px-2 py-1 ${style}`}
          cols="30"
          rows="10"
          value={text}
          onChange={(e) => getFirstLayerQueryCommandContents(e.target.value)}
          onKeyDown={(e) => onKeyDown(e)}
          ref={inputRef}
          placeholder="Task name or type ' / ' for commands "
          autoFocus
          onBlur={() => clearExistingCommands()}
        />
      )}
      {matchingCommands.length !== 0 && (
        <div className="results top-10 mt-1 z-10 ">
          {matchingCommands.map((command, index) => {
            const IconName = Icon[command.icon]
            return (
              <div
                key={index}
                onClick={() => selectTotalCommand(command)}
                onMouseOver={() => setSelectionIndex(index)}
                className={`
                  results__command 
                  ${index == selectionIndex ? "results__command--selected" : ""}
                `}
              >
                <IconName strokeWidth={1.5} />
                <p className="text-lg">{command.name}</p>
              </div>
            )
          })}
        </div>
      )}

      {matchingTimeSettings.length !== 0 && (
        <div className="results top-10 mt-1 z-10">
          {matchingTimeSettings.map((command, index) => {
            const IconName = Icon[command.icon]
            return (
              <div
                key={index}
                onClick={() => selectTimeCommand(command)}
                onMouseOver={() => setSelectionIndex(index)}
                className={`
                  results__command 
                  ${index == selectionIndex ? "results__command--selected" : ""}
                `}
              >
                <IconName strokeWidth={1.5} />
                <p className="text-lg">{command.name}</p>
              </div>
            )
          })}
        </div>
      )}
      {matchingTags.length !== 0 && (
        <div className="results top-10 mt-1 z-10 ">
          {matchingTags.map((child, index) => {
            return (
              <div
                key={child.id}
                onClick={() => selectTags(child)}
                onMouseOver={() => setSelectionIndex(index)}
                className={
                  "results__command " +
                  (index == selectionIndex ? "results__command--selected" : "")
                }
              >
                <Icon.Tag strokeWidth={1.5} />
                <p className="text-lg">{child.name}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TitleEditor
