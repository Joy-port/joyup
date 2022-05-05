import React, { useState, useRef, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from "uuid"
import { TextType } from "../../../helpers/config"
import { task } from "../../../sliceReducers/actions/task"

const TextEditor = () => {
  const { description } = useSelector((state) => state.task)
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(true)
  const [document, setDocument] = useState(description)
  const [HTMLStyle, setHTMLStyle] = useState({})
  const [textContent, setTextContent] = useState({})
  const [text, setText] = useState("")
  const [query, setQuery] = useState(null)
  const [slashCharacterPosition, setSlashCharacterPosition] = useState(null)
  const [selectionIndex, setSelectionIndex] = useState(0)
  const inputRef = useRef()
  const focusInput = useRef()
  const changeTextStyle = useCallback(() => {
    const content = {
      id: inputRef.current.id,
      content: text,
      html: HTMLStyle,
    }
    if (content.length) {
      setTextContent({ ...content })
      const newDoc = [...document]
      const index = newDoc.findIndex((item) => item.id === content.id)
      newDoc.splice(index, 1, content)
      setDocument(newDoc)
    }
  })
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
  const deleteSlashCommand = useCallback(() => {
    setText((text) => {
      const string =
        text.substring(0, slashCharacterPosition) +
        text.substring(inputRef.current?.selectionStart)
      document.find((item) => item.id === inputRef.current.id).content = string
      return string
    })
  })

  // useEffect(() => {
  //   if (!text) return
  //   console.log(text)
  // }, [deleteSlashCommand])

  useEffect(() => {
    dispatch(task.saveTaskDetail("editDescription", [...document]))
  }, [document])

  const matchingCommands =
    query !== null
      ? TextType.filter((command) =>
          command.name.toLowerCase().match(query.toLowerCase())
        )
      : []

  const onChange = (e) => {
    const newText = e.target.value
    setText(newText)
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

  const selectCommand = (command) => {
    deleteSlashCommand()
    document.find((item) => item.id === inputRef.current.id).html = command
    const index = document.findIndex((item) => item.id === inputRef.current.id)
    setHTMLStyle(command)
    setIsEditing(false)
    if (document[index + 1]) {
      setText(document[index + 1].content)
      focusInput.current = document[index + 1].id
      setIsEditing(true)
      setSlashCharacterPosition(null)
      setQuery(null)
    } else {
      const blank = {
        content: "",
        id: uuidv4(),
        html: {
          tag: "p",
          name: "Text",
          style: "",
        },
      }
      addNewBlock(index + 1, blank)
      setTextContent(blank)
      setText(blank.content)
      setHTMLStyle(blank.html)
      focusInput.current = blank.id
      setIsEditing(true)
      setSlashCharacterPosition(null)
      setQuery(null)
    }
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
        changeTextStyle()
        setIsEditing(false)
        const currentBlock = currentBlockIndex()
        const nextBlock =
          currentBlock - 1 > 0 ? toSpecificBlock(currentBlock - 1) : toSpecificBlock(0)
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
        changeTextStyle()
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
        // console.log(matchingCommands[selectionIndex])
        selectCommand(matchingCommands[selectionIndex])
      } else if (slashCharacterPosition === null) {
        changeTextStyle()
        setHTMLStyle({})
        const prevIndex = currentBlockIndex()
        setIsEditing(false)
        const blank = {
          content: "",
          id: uuidv4(),
          html: {
            tag: "p",
            name: "Text",
            style: "",
          },
        }
        addNewBlock(prevIndex + 1, blank)
        setIsEditing(true)
        setTextContent(blank)
        setText(blank.content)
        setHTMLStyle(blank.html)
        focusInput.current = blank.id
        e.stopPropagation()
        e.preventDefault()
        return
      }
    } else if (e.key === "/") {
      setSlashCharacterPosition(inputRef.current?.selectionStart)
    } else if (e.key === "Backspace") {
      // delete docs document block
      // console.log(text)
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
    <div className="flex flex-col min-h-1/4">
      <div className="editor">
        {document &&
          document.map((item, index) => {
            const TagName = item.html.tag
            if (focusInput.current === item.id && isEditing) {
              return (
                <input
                  className={`input-light300 editor-input ${
                    HTMLStyle.style || item.html.style
                  }`}
                  key={item.id}
                  id={item.id}
                  cols="30"
                  rows="10"
                  value={text}
                  onChange={(e) => onChange(e)}
                  onKeyDown={(e) => onKeyDown(e)}
                  ref={inputRef}
                  autoFocus
                />
              )
            } else {
              if (!item.content) {
                return (
                  <p
                    key={item.id}
                    onClick={() => {
                      focusInput.current = item.id
                      setIsEditing(true)
                      setText(item.content)
                      setHTMLStyle(item.html)
                    }}
                  >
                    &#160;
                  </p>
                )
              } else if (item.content && !item.html.parent) {
                return (
                  <TagName
                    key={item.id}
                    className={`editor-text ${item.html.style}`}
                    onClick={() => {
                      focusInput.current = item.id
                      setIsEditing(true)
                      setText(item.content)
                      setHTMLStyle(item.html)
                    }}
                  >
                    {item.content}
                  </TagName>
                )
              } else {
                const TagParent = item.html.parent
                return (
                  <TagParent key={index} id={index} className={item.html.style}>
                    <TagName
                      onClick={() => {
                        focusInput.current = item.id
                        setIsEditing(true)
                        setText(item.content)
                        setHTMLStyle(item.html)
                      }}
                    >
                      {item.content}
                    </TagName>
                  </TagParent>
                )
              }
            }
          })}
      </div>
      {matchingCommands.length !== 0 && (
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
      )}
    </div>
  )
}

export default TextEditor
