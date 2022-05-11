import React, { useState, useRef, useCallback, useEffect } from "react"
import dayjs from "dayjs"
import { useDispatch, useSelector } from "react-redux"
import { task } from "../../../sliceReducers/actions/task"
import * as Icon from "react-feather"

const TitleEditor = () => {
  const { title, startDate, dueDate } = useSelector((state) => state.task)
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
  // const [isSettingTime, setIsSettingTime] = useState(false)
  const [style, setStyle] = useState("heading-four font-semibold")
  const [dateType, setDateType] = useState(null)
  const [editRequiredNumber, setEditRequiredNumber] = useState(false)
  const [selectedTagType, setSelectedTagType] = useState(null)
  const [isEditingTags, setIsEditingTags] = useState(false)
  const [selectedTag, setSelectedTag] = useState(null)
  const inputRef = useRef()
  const timeRef = useRef()
  const titleRef = useRef()
  const setTagsAction = useCallback((tagsName) => {
    setIsEditing(true)
    setStyle("heading-four font-semibold")
    setText(() => {
      const newText = `/${tagsName}`
      return newText
    })
    setIsEditingTags(true)
  })

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
    setStyle("heading-four font-semibold")
  })

  useEffect(() => {
    // if (!inputRef.current) return
    if (
      slashCharacterPosition === null &&
      selectedTagType === null &&
      timeCharacterPosition === null &&
      tagCharacterPosition === null
    ) {
      if (text.trim() === "") return
      titleRef.current = text
      dispatch(task.saveTaskDetail("title", text))
      // setIsEditing(false)
    }
  }, [text])

  const commands = [
    {
      icon: "Calendar",
      name: "Start Date",
      style: "",
      action: () => {
        setIsEditing(true)
        setTimeQuery("")
        setTimeCharacterPosition(inputRef.current.selectionStart - 1)
        setText(() => {
          const newText = titleRef.current + "/Start date:"
          return newText
        })
        setStyle("heading-four font-semibold text-light200")
        setSlashCharacterPosition(null)
        setQuery(null)
        setSelectionIndex(0)
        setDateType("startDate")
      },
    },
    {
      icon: "Sunset",
      name: "Due Date",
      style: "",
      action: function () {
        setIsEditing(true)
        setTimeQuery("")
        setTimeCharacterPosition(inputRef.current.selectionStart - 1)
        setText(() => {
          const newText = titleRef.current + "/Due date:"
          return newText
        })
        setStyle("heading-four font-semibold text-light200")
        //clear first level command element
        setSlashCharacterPosition(null)
        setQuery(null)
        setSelectionIndex(0)
        setDateType("dueDate")
      },
    },
    {
      icon: "Flag",
      name: "priority",
      action: function () {
        setIsEditing(true)
        setTagCharacterPosition(inputRef.current.selectionStart - 1)
        setTagsQuery("")
        setText(() => {
          const newText = titleRef.current + "/Priority:"
          return newText
        })
        setStyle("heading-four font-semibold text-light200")
        setSelectedTagType(types.find((item) => item.type === this.name))
        setQuery(null)
        setSlashCharacterPosition(null)
        setSelectionIndex(0)
      },
    },
    {
      icon: "CheckCircle",
      name: "progress",
      action: function () {
        setIsEditing(true)
        setTagCharacterPosition(inputRef.current.selectionStart - 1)
        setTagsQuery("")
        setText(() => {
          const newText = titleRef.current + "/Progress:"
          return newText
        })
        setStyle("heading-four font-semibold text-light200")
        setSelectedTagType(types.find((item) => item.type === this.name))
        setQuery(null)
        setSlashCharacterPosition(null)
        setSelectionIndex(0)
      },
    },
    // {
    //   icon: "Clock",
    //   name: "Required time",
    //   action: () => {
    //     setEditRequiredNumber(true)
    //     setText(() => {
    //       const newText = titleRef.current + "/Required Clocks:"
    //       return newText
    //     })
    //     setStyle("heading-four font-semibold text-light200")
    //     dispatch(task.saveTaskDetail("requiredNumber", 0))
    //   },
    // },
  ]
  const dateCommands = [
    {
      icon: "Moon",
      name: "today",
      action: () => {
        const date = new Date().getTime()
        const dateContent = { name: dateType, date }
        dispatch(task.saveTaskDate(dateContent))
        editTimeSettingCommand()
      },
    },
    {
      icon: "Sun",
      name: "tomorrow",
      action: () => {
        const date = new Date(new Date().setDate(new Date().getDate() + 1)).getTime()
        const dateContent = { name: dateType, date }
        dispatch(task.saveTaskDate(dateContent))
        editTimeSettingCommand()
      },
    },
    {
      icon: "Sunrise",
      name: "this friday",
      action: () => {
        const rangeFromToday =
          new Date().getDay() < 5
            ? 5 - new Date().getDay() + 7
            : 7 - new Date().getDay() + 5
        const date = new Date(
          new Date().setDate(new Date().getDate() + rangeFromToday)
        ).getTime()
        const dateContent = { name: dateType, date }
        dispatch(task.saveTaskDate(dateContent))
        editTimeSettingCommand()
      },
    },
    {
      icon: "Calendar",
      name: "next week",
      action: () => {
        const date = new Date(new Date().setDate(new Date().getDate() + 7)).getTime()
        const dateContent = { name: dateType, date }
        dispatch(task.saveTaskDate(dateContent))
        editTimeSettingCommand()
      },
    },
  ]

  const deleteSlashCommand = useCallback(() => {
    setText((text) => {
      const string =
        text.substring(0, slashCharacterPosition) +
        text.substring(inputRef.current?.selectionStart)
      return string
    })
  })

  const matchingCommands =
    query !== null
      ? commands.filter((command) =>
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
      ? dateCommands.filter((command) =>
          command.name.toLowerCase().match(timeQuery.toLowerCase())
        )
      : []
  useEffect(() => {
    if (
      matchingCommands.length !== 0 &&
      matchingTags.length !== 0 &&
      matchingTimeSettings.length !== 0
    ) {
      setStyle("heading-four font-semibold")
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

  const selectCommand = (command) => {
    command.action()
    setSelectionIndex(0)
  }

  const selectTags = (child) => {
    const tagType = {
      parent: selectedTagType.id,
      child: child.id,
      type: selectedTagType.type,
    }
    setSelectedTag(child.id)
    dispatch(task.saveTaskTag(tagType))
    setSelectedTagType(null)
    setText((text) => {
      const string =
        text.substring(0, tagCharacterPosition) +
        text.substring(inputRef.current?.selectionStart)
      return string
    })
    setStyle("heading-three")
    setIsEditing(false)
    setSelectionIndex(0)
    setTagsQuery(null)
  }

  const onKeyDown = (e) => {
    console.log("keypress listening", tagCharacterPosition, e.key)
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
        selectCommand(matchingCommands[selectionIndex])
        // setIsEditing(true)
      } else if (matchingTags[selectionIndex]) {
        selectTags(matchingTags[selectionIndex])
      } else if (matchingTimeSettings[selectionIndex]) {
        selectCommand(matchingTimeSettings[selectionIndex])
      } else if (selectedTagType !== null) {
        selectTags()
      } else if (slashCharacterPosition === null && selectedTagType === null) {
        e.stopPropagation()
        e.preventDefault()
        if (text.trim() === "") return
        titleRef.current = text
        dispatch(task.saveTaskDetail("title", text))
        // setIsEditing(false)
        return
      }
    } else if (e.key === "/") {
      setSlashCharacterPosition(inputRef.current?.selectionStart)
    } else if (e.key === "Backspace") {
      console.log(timeQuery, timeCharacterPosition)
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
          className="heading-four font-semibold text-light300 px-2 py-1 rounded"
          onClick={() => {
            // inputRef.current = null
            setIsEditing(true)
            setText(text)
          }}
        >
          {text}
        </div>
      ) : (
        <input
          className={`rounded heading-four input-light300 px-2 py-1 ${style}`}
          cols="30"
          rows="10"
          value={text}
          onChange={(e) => getFirstLayerQueryCommandContents(e.target.value)}
          onKeyDown={(e) => onKeyDown(e)}
          ref={inputRef}
          placeholder="Task name or type ' / ' for commands "
          autoFocus
        />
      )}
      {matchingCommands.length !== 0 && (
        <div className="results top-10 mt-1 z-10 ">
          {matchingCommands.map((command, index) => {
            const IconName = Icon[command.icon]
            return (
              <div
                key={index}
                onClick={() => selectCommand(command)}
                onMouseOver={() => setSelectionIndex(index)}
                className={`
                  results__command 
                  ${index == selectionIndex ? "results__command--selected" : ""}
                `}
              >
                <IconName />
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
                onClick={() => selectCommand(command)}
                onMouseOver={() => setSelectionIndex(index)}
                className={`
                  results__command 
                  ${index == selectionIndex ? "results__command--selected" : ""}
                `}
              >
                <IconName strokeWidth={1} />
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
                <Icon.Tag strokeWidth={1} />
                <p className="text-lg">{child.name}</p>
              </div>
            )
          })}
          {/* {selectedTagType?.child && (
        <div className="results top-10 mt-1 z-10 ">
          {selectedTagType.child.map((child, index) => {
            return (
              <div
                key={child.id}
                onClick={() => selectTags(child.id)}
                onMouseOver={() => setSelectionIndex(index)}
                className={
                  "results__command " +
                  (index == selectionIndex ? "results__command--selected" : "")
                }
              >
                <Icon.Tag strokeWidth={1} />
                <p className="text-lg">{child.name}</p>
              </div>
            )
          })} */}
        </div>
      )}
    </div>
  )
}

export default TitleEditor
