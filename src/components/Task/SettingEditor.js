import React, { useState, useRef, useCallback, useEffect, useContext } from "react"
import DatePick from "./DatePicker"
import dayjs from "dayjs"
import TasksContent from "./TasksReducer"

// eslint-disable-next-line react/prop-types
const SettingEditor = ({ setStartDate, setDueDate }) => {
  const [state, dispatch] = useContext(TasksContent)
  const [isEditing, setIsEditing] = useState(true)
  const [text, setText] = useState("")
  const [query, setQuery] = useState(null)
  const [slashCharacterPosition, setSlashCharacterPosition] = useState(null)
  const [selectionIndex, setSelectionIndex] = useState(0)
  const [isSettingTime, setIsSettingTime] = useState(false)
  const inputRef = useRef()
  const [date, setDate] = useState(new Date())
  const [editRequiredNumber, setEditRequiredNumber] = useState(false)
  const [requiredNumber, setRequiredNumber] = useState(null)
  const timeRef = useRef()

  useEffect(() => {
    if (!date || !text) return
    if (date) {
      if (!timeRef) return
      const hourMinutes = dayjs(date).format("HH:mm")
      if (hourMinutes === timeRef.current) return
      let name = ""
      if (!text) return
      if (text.includes("Start")) {
        name = "/Start Date"
        setStartDate(date)
      } else if (text.includes("Due")) {
        name = "/Due Date"
        setDueDate(date)
      }
      setText(() => {
        const selectedDate = dayjs(date).format("MM/DD HH:mm")
        return name + ":" + selectedDate
      })
      timeRef.current = dayjs(date).format("HH:mm")
      setIsSettingTime(false)
      setText("")
      setQuery(null)
      deleteSlashCommand()
      setSlashCharacterPosition(null)
    }
  }, [date])

  useEffect(() => {
    if (!text) return
    if (editRequiredNumber) {
      if (!text.includes("Required")) return
      const number = parseFloat(text.split(":")[1].trim())
      if (!number) return
      dispatch({ type: "requiredClock", payload: number })
      setText("")
      setQuery(null)
      deleteSlashCommand()
      setSlashCharacterPosition(null)
    }
  }, [setEditRequiredNumber, editRequiredNumber, text])
  const commands = [
    {
      name: "Start Date",
      style: "",
      action: () => {
        setIsEditing(true)
        setIsSettingTime(true)
        setText(() => {
          const newText = "/Start Date"
          return newText
        })
      },
    },
    {
      name: "Due Date",
      style: "",
      action: function () {
        setIsEditing(true)
        setIsSettingTime(true)
        setText(() => {
          const newText = "/Due Date"
          return newText
        })
      },
    },
    {
      name: "required clock numbers",
      action: () => {
        setEditRequiredNumber(true)
        setText(() => {
          const newText = "/Required Clocks:"
          return newText
        })
        setRequiredNumber(0)
      },
    },
    {
      name: "set Time numbers",
      action: () => {
        setText("")
      },
    },
  ]

  const handleChangeRaw = (value) => {
    if (value === "tomorrow") {
      setStartDate(dayjs().add(new Date(), 1))
    }
  }

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

  const onChange = (e) => {
    const newText = e.target.value
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
    }
  }

  const selectCommand = (command) => {
    command.action()
  }

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      if (slashCharacterPosition === null) {
        return
      } else {
        setSelectionIndex((prevIndex) => Math.max(0, prevIndex - 1))
        e.stopPropagation()
        e.preventDefault()
      }
    } else if (e.key === "ArrowDown") {
      if (slashCharacterPosition === null) {
        return
      } else {
        setSelectionIndex((prevIndex) =>
          Math.min(matchingCommands.length - 1, prevIndex + 1)
        )
        e.stopPropagation()
        e.preventDefault()
      }
    } else if (e.key === "Enter") {
      if (matchingCommands[selectionIndex]) {
        selectCommand(matchingCommands[selectionIndex])
        // setIsEditing(true)
      } else if (slashCharacterPosition === null) {
        dispatch({ type: "setTitle", payload: text })
        setIsEditing(false)
        e.stopPropagation()
        e.preventDefault()
        return
      }
    } else if (e.key === "/") {
      setSlashCharacterPosition(inputRef.current?.selectionStart)
    }
  }

  return (
    <div className="flex flex-col">
      {text !== "" && !isEditing ? (
        <div
          className="heading-one"
          onClick={() => {
            setIsEditing(true)
            setText(text)
          }}
        >
          {text}
        </div>
      ) : (
        <input
          className="heading-one"
          cols="30"
          rows="10"
          value={text}
          onChange={(e) => onChange(e)}
          onKeyDown={(e) => onKeyDown(e)}
          ref={inputRef}
          placeholder="Title..."
          autoFocus
        />
      )}
      <div className="results">
        {matchingCommands.map((command, index) => (
          <div
            key={index}
            onClick={() => selectCommand(command)}
            onMouseOver={() => setSelectionIndex(index)}
            className={
              "results__command " +
              (index == selectionIndex ? "results__command--selected" : "")
            }
          >
            {command.name}
          </div>
        ))}
      </div>
      {isSettingTime && <DatePick date={date} setDate={setDate} showType={true} />}
    </div>
  )
}

export default SettingEditor
