import React, { useState, useRef, useCallback } from "react"

const SettingEditor = () => {
  const [isEditing, setIsEditing] = useState(true)
  const [text, setText] = useState("")
  const [query, setQuery] = useState(null)
  const [slashCharacterPosition, setSlashCharacterPosition] = useState(null)
  const [selectionIndex, setSelectionIndex] = useState(0)
  const inputRef = useRef()
  const commands = [
    {
      name: "Heading 1",
      style: "heading-1",
      action: () => {
        setText(
          (text) =>
            text.substring(0, slashCharacterPosition) +
            "🐕" +
            text.substring(slashCharacterPosition)
        )
      },
    },
    {
      name: "Bulleted List",
      style: "dot",
      action: function () {
        alert("open window")
      },
    },
    {
      name: "Code",
      action: () => {
        setText("")
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
    deleteSlashCommand()
    setIsEditing(false)
    command.action()
    setIsEditing(true)
    setSlashCharacterPosition(null)
    setQuery(null)
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
        console.log(matchingCommands[selectionIndex])
        selectCommand(matchingCommands[selectionIndex])
      } else if (slashCharacterPosition === null) {
        setIsEditing(false)
        setIsEditing(true)
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
          onClick={() => {
            setIsEditing(true)
            setText = { text }
          }}
        >
          {" "}
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
    </div>
  )
}

export default SettingEditor
