import React, { useCallback } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

const Context = () => {
  const onBeforeCapture = useCallback(() => {
    /*...*/
  }, [])
  const onBeforeDragStart = useCallback(() => {
    /*...*/
  }, [])
  const onDragStart = useCallback(() => {
    /*...*/
  }, [])
  const onDragUpdate = useCallback(() => {
    /*...*/
  }, [])
  const onDragEnd = useCallback(() => {
    // the only one that is required
  }, [])

  return (
    <div className="grow">
      <DragDropContext
        onBeforeCapture={onBeforeCapture}
        onBeforeDragStart={onBeforeDragStart}
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId="droppable-1" type="PERSON">
          {(provided, snapshot) => (
            <Draggable draggableId="draggable-1" index={0}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <h4>My draggable</h4>
                </div>
              )}
            </Draggable>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default Context
