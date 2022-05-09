import React, { useState, useRef, useCallback, useEffect } from "react"
import DatePick from "../components/DatePicker"
import dayjs from "dayjs"
import { useDispatch, useSelector } from "react-redux"
import { task } from "../../../sliceReducers/actions/task"
import * as Icon from "react-feather"

const TitleEditor = () => {
  const { title } = useSelector((state) => state.task)
  const { types } = useSelector((state) => state.tags)
  const dispatch = useDispatch()
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
  const [date, setDate] = useState(new Date())
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

  // useEffect(() => {
  //   if (!date || !text || !text.includes("/")) return
  //   if (date) {
  //     if (!timeRef) return
  //     const hourMinutes = dayjs(date).format("HH:mm")
  //     if (hourMinutes === timeRef.current) return
  //     let name = ""
  //     if (!text) return
  //     if (text.includes("Start")) {
  //       name = "/Start Date"
  //       const dateContent = {
  //         name: "startDate",
  //         date,
  //       }
  //       dispatch(task.saveTaskDate(dateContent))
  //     } else if (text.includes("Due")) {
  //       name = "/Due Date"
  //       const dateContent = {
  //         name: "dueDate",
  //         date,
  //       }
  //       dispatch(task.saveTaskDate(dateContent))
  //     }
  //     setText(() => {
  //       const selectedDate = dayjs(date).format("MM/DD HH:mm")
  //       return name + ":" + selectedDate
  //     })
  //     timeRef.current = dayjs(date).format("HH:mm")
  //     setStyle("heading-three")
  //     setIsSettingTime(false)
  //     titleRef.current ? setText(titleRef.current) : setText("")
  //     deleteSlashCommand()
  //   }
  // }, [date])

  // useEffect(() => {
  //   if (!text) return
  //   if (editRequiredNumber) {
  //     if (!text.includes("Required")) return
  //     const number = parseFloat(text.split(":")[1].trim())
  //     if (!number) return
  //     dispatch(task.saveTaskDetail("requiredNumber", parseFloat(number)))
  //     setText("")
  //     setQuery(null)
  //     deleteSlashCommand()
  //     setSlashCharacterPosition(null)
  //   }
  // }, [setEditRequiredNumber, editRequiredNumber, text])
  //save text
  useEffect(() => {
    // if (!inputRef.current) return
    if (
      slashCharacterPosition === null &&
      selectedTagType === null &&
      timeCharacterPosition === null &&
      tagCharacterPosition === null
    ) {
      if (text.trim() === "") return
      console.log(text)
      titleRef.current = text
      console.log("save", text)
      console.log(titleRef.current)
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
        // setIsSettingTime(true)
        const newText = "/Start date:"
        setText(newText)
        setStyle("heading-four font-semibold text-light200")
        //clear first level command element
        setSlashCharacterPosition(null)
        setQuery(null)
        //add time level command
        setTimeCharacterPosition(inputRef.current.selectionStart)
        getSecondLayerCommandContents(newText)
        // console.log(inputRef.current.selectionIndex, inputRef.current.selectionStart)
      },
    },
    {
      icon: "Sunset",
      name: "Due Date",
      style: "",
      action: function () {
        setIsEditing(true)
        setText(() => {
          const newText = "/Due Date"
          return newText
        })
        setStyle("heading-four font-semibold text-light200")
        setQuery(null)
        setSlashCharacterPosition(null)
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
    {
      icon: "Flag",
      name: "priority",
      action: function () {
        setIsEditing(true)
        setTagCharacterPosition(inputRef.current.selectionStart - 1)
        setTagsQuery("")
        setText(() => {
          const newText = titleRef.current + "/Priority :"
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
          const newText = titleRef.current + "/Priority :"
          return newText
        })
        setStyle("heading-four font-semibold text-light200")
        setSelectedTagType(types.find((item) => item.type === this.name))
        setQuery(null)
        setSlashCharacterPosition(null)
        setSelectionIndex(0)
      },
    },
  ]
  const dateCommands = [
    {
      icon: "Moon",
      name: "today",
      action: () => {},
    },
    {
      icon: "Sun",
      name: "tomorrow",
      action: () => {},
    },
    {
      icon: "Sunrise",
      name: "this friday",
      action: () => {},
    },
    {
      icon: "Calendar",
      name: "next week",
      action: () => {},
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

  const getFirstLayerQueryCommandContents = (inputTextContent) => {
    const newText = inputTextContent
    setText(newText)
    console.log("first layer commands", slashCharacterPosition)
    console.log(
      "second layer commands",
      "tag",
      tagCharacterPosition,
      tagEndCharacterPosition
    )
    console.log("second layer commands", "time", timeCharacterPosition)
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
      console.log("run TIME layer command")
      const isSlashStillActive = newText[timeCharacterPosition] === "/"
      console.log(isSlashStillActive, timeCharacterPosition)
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
  const selectTime = (time) => {
    time.action()
    setSelectionIndex(0)
  }

  const onKeyDown = (e) => {
    console.log("keypress listening", tagCharacterPosition)
    if (e.key === "ArrowUp") {
      if (slashCharacterPosition !== null) {
        setSelectionIndex((prevIndex) => Math.max(0, prevIndex - 1))
        e.stopPropagation()
        e.preventDefault()
      } else if (tagCharacterPosition !== null) {
        console.log(selectionIndex)
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
      }
      return
    } else if (e.key === "Enter") {
      if (matchingCommands[selectionIndex]) {
        selectCommand(matchingCommands[selectionIndex])
        // setIsEditing(true)
      } else if (matchingTags[selectionIndex]) {
        selectTags(matchingTags[selectionIndex])
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
          className={`rounded input-light300 px-2 py-1 ${style}`}
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
        <div className="results top-10 mt-1 z-10 ">
          {matchingTimeSettings.map((command, index) => {
            const IconName = Icon[command.icon]
            return (
              <div
                key={index}
                onClick={() => selectTime(command)}
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
      {/* {isSettingTime && (
        <div className="absolute top-10 mt-1 z-10">
          <DatePick date={date} setDate={setDate} showType={true} />
        </div>
      )} */}
      {matchingTags.length !== 0 && (
        <div className="results top-10 mt-1 z-10 ">
          {matchingTags.map((child, index) => {
            console.log(child)
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
