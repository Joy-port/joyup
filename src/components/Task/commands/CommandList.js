import React, { useState, useRef } from "react"

const CommandList = () => {
  const [text, setText] = useState("")
  const [query, setQuery] = useState(null)
  const [slashCharacterPosition, setSlashCharacterPosition] = useState(null)
  const [selectionIndex, setSelectionIndex] = useState(0)
  const inputRef = useRef()
  const commands = [
    {
      text: "Insert Dog",
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
      text: "Say Hello",
      action: () => {
        alert("Hello")
      },
    },
    {
      text: "Delete Text",
      action: () => {
        setText("")
      },
    },
  ]
  const matchingCommands =
    query !== null
      ? commands.filter((command) =>
          command.text.toLowerCase().match(query.toLowerCase())
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
  const deleteSlashCommand = () => {
    setText(
      text.substring(0, slashCharacterPosition) +
        text.substring(inputRef.current?.selectionStart)
    )
  }

  const selectCommand = (command) => {
    deleteSlashCommand()
    command.action()
    setQuery(null)
  }

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      setSelectionIndex((prevIndex) => Math.max(0, prevIndex - 1))
      e.stopPropagation()
      e.preventDefault()
    } else if (e.key === "ArrowDown") {
      setSelectionIndex((prevIndex) =>
        Math.min(matchingCommands.length - 1, prevIndex + 1)
      )
      e.stopPropagation()
      e.preventDefault()
    } else if (e.key === "Enter") {
      matchingCommands[selectionIndex] && selectCommand(matchingCommands[selectionIndex])
      e.stopPropagation()
      e.preventDefault()
    } else if (e.key === "/") {
      setSlashCharacterPosition(inputRef.current?.selectionStart)
    }
  }
  return (
    <div className="flex flex-col">
      <input
        name="text"
        id="text"
        cols="30"
        rows="10"
        value={text}
        onChange={(e) => onChange(e)}
        onKeyDown={(e) => onKeyDown(e)}
        ref={inputRef}
      ></input>
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
            {command.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommandList
