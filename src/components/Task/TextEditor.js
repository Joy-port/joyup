import React, { useState, useRef, useEffect } from "react"
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js"

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" },
]

const TextEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const content = localStorage.getItem("content")
    if (content) {
      return EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
    } else {
      return EditorState.createEmpty()
    }
  })
  const editorRef = useRef(null)
  useEffect(() => {
    console.log(editorState.content)
  }, [editorState])

  const saveContent = (content) => {
    const contentState = editorState.getCurrentContent()
    window.localStorage.setItem("content", JSON.stringify(convertToRaw(contentState)))
    setEditorState(content)
  }
  return (
    <div
      className="editor-container"
      onClick={() => {
        editorRef && editorRef.current.focus()
      }}
    >
      <Editor
        editorState={editorState}
        onChange={saveContent}
        placeholder="description"
        ref={editorRef}
      />
    </div>
  )
}

export default TextEditor
