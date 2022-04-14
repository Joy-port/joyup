import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  Editor,
  EditorState,
  EditorBlock,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  DefaultDraftBlockRenderMap,
} from "draft-js"

import Immutable from "immutable"

function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType()
  if (type === "atomic") {
    return {
      component: MediaComponent,
      editable: false,
      props: {
        foo: "bar",
      },
    }
  }
}

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

const TextEditBlock = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onChange = useCallback((edit) => setEditorState(edit))
  const editorRef = useRef()
  const onBoldClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, "BOLD"))
  }
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  const blockRenderMap = Immutable.Map({
    "header-two": {
      element: "h2",
    },
    unstyled: {
      element: "h2",
    },
  })
  const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap)
  console.log(extendedBlockRenderMap)
  return (
    <>
      <button onClick={onBoldClick}>B</button>
      <div className="bg-white" oncClick={() => editorRef.current.focus()}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          blockRendererFn={myBlockRenderer}
          ref={editorRef}
          blockRenderMap={extendedBlockRenderMap}
        />
      </div>
    </>
  )
}

//with editor
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

export default TextEditBlock
