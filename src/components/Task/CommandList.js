import React, { useState, useRef, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

const Docs = [
  {
    id: "asdasd",
    content: "this is p",
    tag: "p",
    style: "",
  },
  {
    id: "asd",
    content: "this is h1",
    tag: "h1",
    style: "",
  },
  {
    id: "asasd",
    content: "This is h2",
    tag: "h2",
    style: "",
  },
]

const CommandList = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [document, setDocument] = useState(Docs)
  const [textContent, setTextContent] = useState({})
  const [text, setText] = useState("")
  const [query, setQuery] = useState(null)
  const [slashCharacterPosition, setSlashCharacterPosition] = useState(null)
  const [selectionIndex, setSelectionIndex] = useState(0)
  const inputRef = useRef()
  const focusInput = useRef()
  const commands = [
    {
      text: "Heading 1",
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
      text: "Bulleted List",
      style: "dot",
      action: function () {
        setTextContent((prev) => {
          return { ...prev, className: this.style }
        })
      },
    },
    {
      text: "Code",
      action: () => {
        setText("")
      },
    },
  ]
  const addNewBlock = useCallback((index, content) => {
    const newDoc = [...document]
    newDoc.splice(index, 0, content)
    setDocument(newDoc)
  })
  const currentBlockIndex = useCallback(() => {
    return document.findIndex((item) => item.id === inputRef.current.id)
  })
  const toSpecificBlock = useCallback((index) => {
    return document.find((item, i) => i === index)
  })

  const matchingCommands =
    query !== null
      ? commands.filter((command) =>
          command.text.toLowerCase().match(query.toLowerCase())
        )
      : []

  const onChange = (e) => {
    const newText = e.target.value
    setText(newText) //save
    document.find((item) => item.id === inputRef.current.id).content = newText
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
  // const addNewBlock = (index, content) => {
  //   const newDoc = [...document]
  //   newDoc.splice(index, 0, content)
  //   setDocument(newDoc)
  // }
  // const currentBlockIndex = () => {
  //   return document.findIndex((item) => item.id === inputRef.current.id)
  // }
  // const toSpecificBlock = (index) => {
  //   return document.find((item, i) => i === index)
  // }

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      if (slashCharacterPosition === null) {
        setIsEditing(false)
        const currentBlock = currentBlockIndex()
        const nextBlock =
          currentBlock - 1 > 0 ? toSpecificBlock(currentBlock - 1) : toSpecificBlock(0)
        console.log(currentBlock, nextBlock)
        setText(nextBlock.content)
        focusInput.current = nextBlock.id
        setIsEditing(true)
      } else {
        setSelectionIndex((prevIndex) => Math.max(0, prevIndex - 1))
        e.stopPropagation()
        e.preventDefault()
      }
    } else if (e.key === "ArrowDown") {
      if (slashCharacterPosition === null) {
        setIsEditing(false)
        const totalLength = document.length
        const currentBlock = currentBlockIndex()
        const nextBlock =
          currentBlock + 1 > totalLength
            ? toSpecificBlock(currentBlock + 1)
            : toSpecificBlock(totalLength - 1)
        setText(nextBlock.content)
        focusInput.current = nextBlock.id
        setIsEditing(true)
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
      } else if (slashCharacterPosition === null) {
        const prevIndex = currentBlockIndex()
        setIsEditing(false)
        const blank = {
          content: "",
          id: uuidv4().toString(),
          tag: "p",
        }
        addNewBlock(prevIndex + 1, blank)
        setIsEditing(true)
        setText(blank.content)
        focusInput.current = blank.id
        return
      }
      e.stopPropagation()
      e.preventDefault()
    } else if (e.key === "/") {
      setSlashCharacterPosition(inputRef.current?.selectionStart)
    } else if (e.key === "Backspace") {
      console.log(text)
      if (text === "") {
        setIsEditing(false)
        const prevBlock = currentBlockIndex()
        const currentBlock =
          prevBlock + 1 > document.length
            ? toSpecificBlock(prevBlock + 1)
            : toSpecificBlock(document.length - 1)
        setText(currentBlock.content)
        focusInput.current = currentBlock.id
        setIsEditing(true)
      }
    }
  }

  return (
    <div className="flex flex-col">
      <>
        {document &&
          document.map((item) => {
            const TagName = item.tag
            if (focusInput.current === item.id && isEditing) {
              return (
                <input
                  key={item.id}
                  id={item.id}
                  cols="30"
                  rows="10"
                  value={text}
                  onChange={(e) => onChange(e)}
                  onKeyDown={(e) => onKeyDown(e)}
                  ref={inputRef}
                  placeholder="description..."
                  autoFocus
                />
              )
            } else {
              return (
                <TagName
                  key={item.id}
                  onClick={() => {
                    focusInput.current = item.id
                    setIsEditing(true)
                    setText(item.content)
                    setTextContent(item)
                  }}
                >
                  {item.content}
                </TagName>
              )
            }
          })}
      </>
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
