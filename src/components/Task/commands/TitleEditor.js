import React, { useState, useRef, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as Icon from "react-feather"
import { task } from "../../../store/actions/task"
import { titleCommandList, dateCommandList } from "../../../utils/slashCommands"

const TitleEditor = () => {
  const { title } = useSelector((state) => state.task)
  const dispatch = useDispatch()
  const { types } = useSelector((state) => state.tags)
  const [isEditing, setIsEditing] = useState(true)
  const [text, setText] = useState(title)
  const [query, setQuery] = useState(null)
  const [tagsQuery, setTagsQuery] = useState(null)
  const [timeQuery, setTimeQuery] = useState(null)
  const [slashCharacterPosition, setSlashCharacterPosition] = useState(null)
  const [tagCharacterPosition, setTagCharacterPosition] = useState(null)
  const [timeCharacterPosition, setTimeCharacterPosition] = useState(null)
  const [selectionIndex, setSelectionIndex] = useState(0)
  const [style, setStyle] = useState("heading-three font-semibold")
  const [dateType, setDateType] = useState(null)
  const [selectedTagType, setSelectedTagType] = useState(null)
  const inputRef = useRef()
  const titleRef = useRef()

  const clearExistingCommands = () => {
    if (slashCharacterPosition !== null) {
      setText((text) => {
        const string =
          text.substring(0, slashCharacterPosition) +
          text.substring(inputRef.current?.selectionStart)
        return string
      })
    } else if (tagCharacterPosition !== null) {
      setText((text) => {
        const string =
          text.substring(0, tagCharacterPosition) +
          text.substring(inputRef.current?.selectionStart)
        return string
      })
    } else if (timeCharacterPosition !== null) {
      setText((text) => {
        const string =
          text.substring(0, timeCharacterPosition) +
          text.substring(inputRef.current?.selectionStart)
        return string
      })
    }

    setQuery(null)
    setTagsQuery(null)
    setTimeQuery(null)
    setSlashCharacterPosition(null)
    setTagCharacterPosition(null)
    setTimeCharacterPosition(null)
    setSelectionIndex(0)
    setIsEditing(false)
  }
  const editTimeSettingCommand = useCallback(() => {
    setText((text) => {
      const string =
        text.substring(0, timeCharacterPosition) +
        text.substring(inputRef.current?.selectionStart)
      return string
    })
    setDateType(null)
    setTimeCharacterPosition(null)
    setTimeQuery(null)
    setSelectionIndex(0)
    setStyle("heading-three font-semibold")
    setIsEditing(true)
    inputRef.current.focus()
  })

  useEffect(() => {
    if (
      slashCharacterPosition === null &&
      selectedTagType === null &&
      timeCharacterPosition === null &&
      tagCharacterPosition === null
    ) {
      titleRef.current = text
      dispatch(task.saveTaskDetail("title", text))
    }
  }, [text])

  const matchingCommands =
    query !== null
      ? titleCommandList.filter((command) =>
          command.name.toLowerCase().match(query.toLowerCase())
        )
      : []

  const matchingTags =
    tagsQuery !== null
      ? selectedTagType.children.filter((child) =>
          child.name.toLowerCase().match(tagsQuery.toLowerCase())
        )
      : []
  const matchingTimeSettings =
    timeQuery !== null
      ? dateCommandList.filter((command) =>
          command.name.toLowerCase().match(timeQuery.toLowerCase())
        )
      : []
  useEffect(() => {
    if (
      matchingCommands.length !== 0 &&
      matchingTags.length !== 0 &&
      matchingTimeSettings.length !== 0
    ) {
      setStyle("heading-three font-semibold")
    }
  }, [matchingCommands, matchingTags, , matchingTimeSettings])

  const getFirstLayerQueryCommandContents = (inputTextContent) => {
    const newText = inputTextContent
    setText(newText)
    if (slashCharacterPosition !== null) {
      const isSlashStillActive = newText[slashCharacterPosition] === "/"
      if (isSlashStillActive) {
        setQuery(
          newText.substring(slashCharacterPosition + 1, inputRef.current?.selectionStart)
        )
        setSelectionIndex(0)
      } else {
        setSlashCharacterPosition(null)
        setQuery(null)
      }
    } else if (tagCharacterPosition !== null) {
      const isSlashStillActive = newText[tagCharacterPosition] === ":"
      if (isSlashStillActive) {
        setTagsQuery(
          newText.substring(tagCharacterPosition + 1, inputRef.current?.selectionStart)
        )
        setSelectionIndex(0)
      } else {
        setTagCharacterPosition(null)
        setTagsQuery(null)
      }
    } else if (timeCharacterPosition !== null) {
      const isSlashStillActive = newText[timeCharacterPosition] === "/"
      if (isSlashStillActive) {
        setTimeQuery(
          newText.substring(timeCharacterPosition + 1, inputRef.current?.selectionStart)
        )
        setSelectionIndex(0)
      }
    } else {
      setTimeCharacterPosition(null)
      setTimeQuery(null)
    }
  }

  const selectTotalCommand = (command) => {
    setIsEditing(true)
    if (command.type === "tag") {
      setTagsQuery("")
      setTagCharacterPosition(inputRef.current.selectionStart - 1)
    } else {
      setTimeQuery("")
      setTimeCharacterPosition(inputRef.current.selectionStart - 1)
    }

    setText(() => {
      const newText = titleRef.current + `/${command.name}:`
      return newText
    })

    setStyle("heading-three font-semibold text-light200")
    setSlashCharacterPosition(null)
    setQuery(null)
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
    setText((text) => {
      const string =
        text.substring(0, tagCharacterPosition) +
        text.substring(inputRef.current?.selectionStart)
      return string
    })
    setStyle("heading-three")
    setSelectionIndex(0)
    setTagsQuery(null)
    setIsEditing(true)
    inputRef.current.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      if (slashCharacterPosition !== null) {
        setSelectionIndex((prevIndex) => Math.max(0, prevIndex - 1))
        e.stopPropagation()
        e.preventDefault()
      } else if (tagCharacterPosition !== null) {
        setSelectionIndex((prevIndex) => Math.max(0, prevIndex - 1))
        e.stopPropagation()
        e.preventDefault()
      } else if (timeCharacterPosition !== null) {
        setSelectionIndex((prevIndex) => Math.max(0, prevIndex - 1))
        e.stopPropagation()
        e.preventDefault()
      }
      return
    } else if (e.key === "ArrowDown") {
      if (slashCharacterPosition !== null) {
        setSelectionIndex((prevIndex) =>
          Math.min(matchingCommands.length - 1, prevIndex + 1)
        )
        e.stopPropagation()
        e.preventDefault()
      } else if (tagCharacterPosition !== null) {
        setSelectionIndex((prevIndex) => Math.min(matchingTags.length - 1, prevIndex + 1))
        e.stopPropagation()
        e.preventDefault()
      } else if (timeCharacterPosition !== null) {
        setSelectionIndex((prevIndex) =>
          Math.min(matchingTimeSettings.length - 1, prevIndex + 1)
        )
        e.stopPropagation()
        e.preventDefault()
      }
      return
    } else if (e.key === "Enter") {
      if (matchingCommands[selectionIndex]) {
        selectTotalCommand(matchingCommands[selectionIndex])
      } else if (matchingTags[selectionIndex]) {
        selectTags(matchingTags[selectionIndex])
      } else if (matchingTimeSettings[selectionIndex]) {
        selectTimeCommand(matchingTimeSettings[selectionIndex])
      } else if (selectedTagType !== null) {
        selectTags()
      } else if (slashCharacterPosition === null && selectedTagType === null) {
        e.stopPropagation()
        e.preventDefault()
        if (text.trim() === "") return
        titleRef.current = text
        dispatch(task.saveTaskDetail("title", text))
        return
      }
    } else if (e.key === "/") {
      setSlashCharacterPosition(inputRef.current?.selectionStart)
    } else if (e.key === "Backspace") {
      if (!text.includes("/")) {
        setQuery(null)
        setTagsQuery(null)
        setTimeQuery(null)
      } else if (timeCharacterPosition && text.endsWith(":")) {
        e.preventDefault()
        setSlashCharacterPosition(timeCharacterPosition)
        setText((text) => {
          const string = text.substring(0, timeCharacterPosition) + "/"
          return string
        })
        setQuery("")
        setDateType(null)
        setTimeCharacterPosition(null)
        setTimeQuery(null)
        setSelectionIndex(0)
      } else if (tagCharacterPosition && text.endsWith(":")) {
        e.preventDefault()
        setSlashCharacterPosition(tagCharacterPosition)
        setText((text) => {
          const string = text.substring(0, tagCharacterPosition) + "/"
          return string
        })
        setQuery("")
        setDateType(null)
        setTagCharacterPosition(null)
        setTagsQuery(null)
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
          onBlur={() => {
            console.log("blur clear all commands")
            clearExistingCommands()
          }}
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
