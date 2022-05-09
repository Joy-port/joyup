import React, { useState, useRef, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from "uuid"
import { TextType } from "../../../helpers/config"
import { task } from "../../../sliceReducers/actions/task"
import * as Icon from "react-feather"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoffee } from "@fortawesome/free-regular-svg-icons"

const TextEditor = () => {
  const { description } = useSelector((state) => state.task)
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
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
  const deleteBlock = useCallback((index) => {
    const newDoc = [...document]
    newDoc.slice(index, 1)
    setDocument(newDoc)
  })
  const currentBlockIndex = useCallback(() => {
    return document.findIndex((item) => item.id === inputRef.current.id)
  })
  const toSpecificBlock = useCallback((index) => {
    return document.find((_, i) => i === index)
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
  //   console.log("after delete slash command", text)
  //   if (text.trim() === "") {
  // setSlashCharacterPosition(null)
  // setQuery(null)
  //   }
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
    console.log(HTMLStyle, command)
    console.log(toSpecificBlock(currentBlockIndex())) //current block
    if (command.combine) {
      const currentHTMLStyle = HTMLStyle.style
      const addStyle = `${currentHTMLStyle} ${command.style}`
      console.log(addStyle)
      selectCommand((prevStyle) => {
        return {
          ...prevStyle,
          style: addStyle,
        }
      })
      return
    }
    setHTMLStyle(command)
    setSlashCharacterPosition(null)
    setQuery(null)
  }

  const switchToNextLine = useCallback(() => {
    setIsEditing(false)
    const index = document.findIndex((item) => item.id === inputRef.current.id)
    if (document[index + 1]) {
      setText(document[index + 1].content)
      focusInput.current = document[index + 1].id
      setIsEditing(true)
      setSlashCharacterPosition(null)
      setQuery(null)
    } else {
      setHTMLStyle({})
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
      setHTMLStyle({ ...blank.html })
      focusInput.current = blank.id
      setIsEditing(true)
      setSlashCharacterPosition(null)
      setQuery(null)
    }
  })
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
      if (text === "") {
        const prevBlock = currentBlockIndex()
        if (toSpecificBlock(prevBlock).html.name !== "Text") {
          selectCommand({
            parent: "",
            tag: "p",
            name: "Text",
            style: "",
          })
          return
        }
        const currentBlock = prevBlock - 1 < 0 ? prevBlock : prevBlock - 1
        if (prevBlock !== currentBlock) {
          setIsEditing(false)
          deleteBlock(prevBlock)
          const currentContent = toSpecificBlock(currentBlock)
          setIsEditing(true)
          setTextContent(currentContent)
          setText(currentContent.content)
          setHTMLStyle(currentContent.html)
          focusInput.current = currentContent.id
          // document.filter((item) => item.id !== inputRef.current.id)
          // focusInput.current = toSpecificBlock(currentBlock).id
          // setText(toSpecificBlock(currentBlock).content)
        }
      }
    }
  }

  return (
    <div className="flex flex-col min-h-1/4 grow md:grow-0">
      <div
        className={`editor border-1 ${
          isEditing ? "border-light300" : "border-transparent"
        }`}
      >
        <p className="flex gap-5 items-center text-light300 py-2">
          <Icon.Type />
          Description
        </p>
        {document &&
          document.map((item, index) => {
            const TagName = item.html.tag
            const firstInput = index === 0
            if (focusInput.current === item.id && isEditing) {
              return (
                <div className="relative grow flex flex-col" key={item.id}>
                  <input
                    className={`editor-input border-l-transparent ${
                      HTMLStyle.style || item.html.style
                    }`}
                    id={item.id}
                    cols="30"
                    rows="10"
                    value={text}
                    onChange={(e) => onChange(e)}
                    onKeyDown={(e) => onKeyDown(e)}
                    ref={inputRef}
                    autoFocus
                    placeholder={
                      firstInput
                        ? `Description or type '/' for commands`
                        : "Type '/' for commands "
                    }
                  />
                  {matchingCommands.length !== 0 && (
                    <div className=" rounded-b-sm w-full border-1 shadow shadow-light300 absolute top-8 mt-1 bg-white z-10 max-h-56 overflow-y-auto">
                      {matchingCommands.map((command, index) => {
                        const IconName = Icon[command.icon]
                        return (
                          <div
                            key={index}
                            onClick={() => selectCommand(command)}
                            onMouseOver={() => setSelectionIndex(index)}
                            className={`
                              flex gap-2 items-center
                              results__command
                              ${
                                index == selectionIndex
                                  ? "results__command--selected"
                                  : ""
                              }`}
                          >
                            <IconName
                              strokeWidth={command.iconWidth}
                              size={command.iconSize}
                            />
                            <p
                              className={`text-lg ${command.style} ${
                                command.name.includes("List") ? "-ml-4" : ""
                              }`}
                            >
                              {command.name}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            } else {
              if (!item.content) {
                return (
                  <p
                    className={`editor-text border-l-transparent ${item.html.style}`}
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
                    className={`editor-text border-l-transparent ${item.html.style}`}
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
    </div>
  )
}

export default TextEditor
