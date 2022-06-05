import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const useOpenTaskPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { totalTaskList } = useSelector((state) => state.projects)
  const openTaskPage = (taskID, isReplace = false) => {
    const taskDetail = JSON.parse(JSON.stringify(totalTaskList[taskID]))
    dispatch({ type: "task/openSavedTask", payload: taskDetail })
    navigate(`/tasks/${taskID}`, { replace: isReplace })
  }
  return openTaskPage
}

export default useOpenTaskPage
