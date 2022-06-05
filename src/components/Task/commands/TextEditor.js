import { useState, useRef, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as Icon from "react-feather"
import { v4 as uuidv4 } from "uuid"
import { task } from "../../../store/actions/task"
import { TextType } from "../../../utils/config"
import { filterCommandListByQuery } from "../../../utils/helpers"

const TextEditor = () => {
  const { description } = useSelector((state) => state.task)
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useDispatch()

  const [HTMLStyle, setHTMLStyle] = useState({})
  const [textContent, setTextContent] = useState({})
  const [text, setText] = useState("")
  const [query, setQuery] = useState(null)
  const [slashCharacterPosition, setSlashCharacterPosition] = useState(null)
  const [selectionIndex, setSelectionIndex] = useState(0)
  const [isOnComposition, setIsOnComposition] = useState(false)
  const inputRef = useRef()
  const focusInput = useRef()
  const commandFocus = useRef()
  const updateDescription = (newDescription) => {
    dispatch({ type: "task/description", payload: newDescription })
  }
  useEffect(() => {
    focusInput.current = description[0].id
  }, [])

  const clearSlashCommand = () => {
    if (slashCharacterPosition !== null) {
      setText((text) => {
        const string =
          text.substring(0, slashCharacterPosition) +
          text.substring(inputRef.current?.selectionStart)
        return string
      })
    }
    setQuery(null)
    setSlashCharacterPosition(null)
    setSelectionIndex(0)
    setIsOnComposition(false)
    setIsEditing(false)
  }
  const changeTextStyle = useCallback(() => {
    const content = {
      id: inputRef.current.id,
      content: text,
      html: HTMLStyle,
    }
    if (content.length) {
      setTextContent({ ...content })
      const newDoc = [...description]
      const index = newDoc.findIndex((item) => item.id === content.id)
      newDoc.splice(index, 1, content)
      updateDescription(newDoc)
    }
  })
  useEffect(() => {
    if (isEditing) return
    if (description.length === 1 && text === "") {
      setText("Description")
      const newDescription = description.find((item) => item.id === focusInput.current)
      newDescription.content = "Description"
      newDescription.html = {
        parent: "",
        tag: "p",
        name: "",
        style: "",
      }
      dispatch({ type: "task/description", payload: [newDescription] })
    }
  }, [isEditing])
  const addNewBlock = useCallback((index, content) => {
    const newDoc = [...description]
    newDoc.splice(index, 0, content)
    updateDescription(newDoc)
  })
  const deleteBlock = useCallback((index) => {
    const newDoc = [...description]
    newDoc.splice(index, 1)
    updateDescription(newDoc)
  })
  const currentBlockIndex = useCallback(() => {
    return description.findIndex((item) => item.id === inputRef.current.id)
  })
  const toSpecificBlock = useCallback((index) => {
    return description.find((_, i) => i === index)
  })
  const deleteSlashCommand = useCallback(() => {
    setText((text) => {
      const string =
        text.substring(0, slashCharacterPosition) +
        text.substring(inputRef.current?.selectionStart)
      description.find((item) => item.id === inputRef.current.id).content = string
      return string
    })
  })
  useEffect(() => {
    if (selectionIndex !== null && commandFocus.current) {
      commandFocus.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [commandFocus.current])
  useEffect(() => {
    dispatch(task.saveTaskDetail("editDescription", [...description]))
  }, [description])

  const matchingCommands = query !== null ? filterCommandListByQuery(TextType, query) : []

  const onChange = (inputText) => {
    const newText = inputText
    setText(newText)
    description.find((item) => item.id === inputRef.current.id).content = newText
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
    description.find((item) => item.id === inputRef.current.id).html = command
    setHTMLStyle(command)
    setSlashCharacterPosition(null)
    setQuery(null)
    inputRef.current.focus()
    setIsEditing(true)
  }
  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      if (slashCharacterPosition === null) {
        changeTextStyle()
        setIsEditing(false)
        const currentBlock = currentBlockIndex()
        const nextBlock =
          currentBlock - 1 > 0 ? toSpecificBlock(currentBlock - 1) : toSpecificBlock(0)
        setText(nextBlock.content)
        setHTMLStyle(nextBlock.html)
        focusInput.current = nextBlock.id
        setIsEditing(true)
      } else {
        setSelectionIndex((prevIndex) => {
          if (prevIndex === 0) {
            return matchingCommands.length - 1
          }
          return Math.max(0, prevIndex - 1)
        })
        e.stopPropagation()
        e.preventDefault()
      }
    } else if (e.key === "ArrowDown") {
      if (slashCharacterPosition === null) {
        changeTextStyle()
        setIsEditing(false)
        const totalLength = description.length
        const currentBlock = currentBlockIndex()
        const nextBlock =
          currentBlock + 1 === totalLength
            ? toSpecificBlock(0)
            : toSpecificBlock(currentBlock + 1)

        setText(nextBlock.content)
        setHTMLStyle(nextBlock.html)
        focusInput.current = nextBlock.id
        setIsEditing(true)
      } else {
        setSelectionIndex((prevIndex) =>
          prevIndex + 1 === matchingCommands.length
            ? 0
            : Math.min(matchingCommands.length - 1, prevIndex + 1)
        )
        e.stopPropagation()
        e.preventDefault()
      }
    } else if (e.key === "Enter") {
      if (matchingCommands[selectionIndex]) {
        selectCommand(matchingCommands[selectionIndex])
      } else if (slashCharacterPosition === null) {
        if (isOnComposition) return
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
      if (isOnComposition) return
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
          e.preventDefault()
          setIsEditing(false)
          deleteBlock(prevBlock)
          const currentContent = toSpecificBlock(currentBlock)
          setTextContent(currentContent)
          setText(currentContent.content)
          setHTMLStyle(currentContent.html)
          focusInput.current = currentContent.id
          setIsEditing(true)
        }
      }
    }
  }
  const compositionStatus = (e) => {
    if (e.type === "compositionend") {
      setIsOnComposition(false)
      setText(e.target.value)
      return
    }
    setIsOnComposition(true)
  }

  return (
    <div className="flex flex-col min-h-1/4" id="taskEditorDescription">
      <div
        className={`editor border-1 min-h-fix-400 ${
          isEditing ? "border-light300" : "border-transparent"
        }`}
        onClick={() => setIsEditing(true)}
      >
        <div className="text-light300 group-title">
          <Icon.Type strokeWidth={1.5} />
        </div>
        <div className="grow flex flex-col relative">
          {description &&
            description.map((item, index) => {
              const TagName = item.html.tag
              const firstInput = index === 0
              if (focusInput.current === item.id && isEditing) {
                return (
                  <div className="relative flex flex-col" key={item.id}>
                    <input
                      className={`editor-input border-l-transparent ${
                        HTMLStyle.style || item.html.style
                      }`}
                      id={item.id}
                      cols="30"
                      rows="10"
                      value={text}
                      onChange={(e) => onChange(e.target.value)}
                      onKeyDown={(e) => onKeyDown(e)}
                      onCompositionStart={(e) => compositionStatus(e)}
                      onCompositionUpdate={(e) => compositionStatus(e)}
                      onCompositionEnd={(e) => compositionStatus(e)}
                      ref={inputRef}
                      onBlur={clearSlashCommand}
                      autoFocus
                      placeholder={
                        firstInput
                          ? `Description or type '/' for commands`
                          : "Type '/' for commands "
                      }
                    />
                    {matchingCommands.length !== 0 && (
                      <div className="results top-8 mt-1 z-10  max-h-56 ">
                        {matchingCommands.map((command, index) => {
                          const IconName = Icon[command.icon]
                          const isSelectedCommand = index === selectionIndex
                          return (
                            <div
                              key={index}
                              onClick={() => {
                                selectCommand(command)
                              }}
                              onMouseOver={() => setSelectionIndex(index)}
                              ref={isSelectedCommand ? commandFocus : null}
                              className={`
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
              }
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
              }
              if (item.content && !item.html.parent) {
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
              }
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
            })}
        </div>
      </div>
    </div>
  )
}

export default TextEditor
