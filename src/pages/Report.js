import React, { useCallback, useContext, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useDispatch, useSelector } from "react-redux"
import { BarChart2 } from "react-feather"
import {
  VictoryPie,
  VictoryContainer,
  VictoryChart,
  VictoryArea,
  VictoryTheme,
} from "victory"
// import {
//   scaleDiscontinuous,
//   discontinuitySkipWeekends,
// } from "@d3fc/d3fc-discontinuous-scale"
// import { scaleTime } from "d3-scale"
// import CalendarHeatmap from "reactjs-calendar-heatmap"
import { getClockTime } from "../helpers/functions"
import Loader from "../components/Loader"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../components/AuthProvider"

const Report = () => {
  const [userDetail, loading, error] = useContext(AuthContext)
  const [openSelector, setOpenSelector] = useState(false)
  const { userTasks, userProjects } = useSelector((state) => state.user)
  const { totalTaskList, totalProjectList, projectList } = useSelector(
    (state) => state.projects
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tags = useSelector((state) => state.tag)
  const [type, setType] = useState(0)
  const [selectedProject, setSelectedProject] = useState(projectList[0])
  const [userTaskDetail, setUserTaskDetail] = useState(() => {
    return userTasks.map((taskID) => {
      const taskDetail = totalTaskList[taskID]
      return { ...taskDetail }
    })
  })
  const [taskPie, setTaskPie] = useState(() => {
    const taskConvertToPie = userTaskDetail.reduce((total, task) => {
      if (!totalProjectList) return total
      const taskProject = totalProjectList[task.projectID]
      console.log(totalProjectList[task.projectID])
      if (!task.projectID) return total
      if (!taskProject) return total
      if (task.totalTime < 600) {
        return total
      } else {
        if (!total[taskProject.id]) {
          total[taskProject.id] = {
            id: taskProject.id,
            x: taskProject.title,
            y: task.totalTime / 3600,
            tasks: [...taskProject.tasks],
          }
        } else {
          if (total[taskProject.id].id === taskProject.id) {
            const previousTotalTime = total[taskProject.id].y
            total[taskProject.id] = {
              ...total[taskProject.id],
              y: parseFloat(previousTotalTime + task.totalTime),
            }
          }
        }
        return total
      }
    }, {})
    console.log(taskConvertToPie)
    return taskConvertToPie
  })
  const switchProjectTasks = useCallback(() => {
    const combineTaskDate = userTaskDetail
      .filter((task) => task.projectID === selectedProject)
      .map((task) => {
        const taskDate = {
          start: new Date(task.startDate),
          end: new Date(task.dueDate),
          x: new Date(new Date(task.startDate).toDateString()),
          y: parseFloat(getClockTime(task.totalTime / 3600).split(":")[0]) || 0,
          y0: parseFloat(getClockTime(task.totalTime / 60).split(":")[1]),
        }
        return taskDate
      })
      .sort((a, b) => a.x - b.x)
    return combineTaskDate
  })
  const [taskDateRange, setTaskDateRange] = useState(() => {
    const data = switchProjectTasks()
    return data
  })
  useEffect(() => {
    if (!userDetail) return
    if (userTasks.length === 0) {
      // alert("there are no projects please create a new one")
      dispatch({
        type: "alert/status",
        payload: {
          text: "there are no tasks please create a new one",
          type: "info",
        },
      })
      navigate("/projects")
    }
  }, [userProjects, userTasks])
  useEffect(() => {
    setTaskDateRange(() => {
      const data = switchProjectTasks()
      return data
    })
  }, [selectedProject])
  return (
    <>
      <Helmet>
        <title>JoyUp | Reports</title>
      </Helmet>
      {totalProjectList && selectedProject && totalProjectList[selectedProject] ? (
        <>
          <div className="menu-container">
            <div className="menu-item">
              <BarChart2 />
              Time Spending
            </div>
          </div>
          <div className="md:-mt-5 md:min-h-18 md:mb-3"></div>
          <div className="grow flex flex-col md:flex-row md:gap-4 md:overflow-y-auto scrollbar">
            <div className="w-1/2 text-sm mb-10 h-max">
              <h1 className="tag-light200 w-56 px-2 py-1 text-center">
                Total Time Spending
              </h1>
              {Object.keys(taskPie).length === 0 ? (
                <div className="w-full">--</div>
              ) : (
                <div className="border-rounded-light000 pb-8">
                  <VictoryPie
                    data={Object.values(taskPie)}
                    colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
                    containerComponent={<VictoryContainer preserveAspectRatio="none" />}
                    animate={{
                      duration: 2000,
                    }}
                    events={[
                      {
                        target: "data",
                        eventHandlers: {
                          onClick: () => {
                            return [
                              {
                                target: "data",
                                mutation: ({ slice, style }) => {
                                  setSelectedProject(slice.data.id)
                                  return style.fill === "#c43a31"
                                    ? null
                                    : { style: { fill: "#c43a31" } }
                                },
                              },
                              // {
                              //   target: "labels",
                              //   mutation: ({ text }) => {
                              //     return text === "clicked" ? null : { text: "clicked" }
                              //   },
                              // },
                            ]
                          },
                        },
                      },
                    ]}
                  />
                </div>
              )}
            </div>
            <div className="text-sm w-full md:w-1/2 h-max">
              <h1 className="tag-light200 w-56 px-2 py-1 text-center">
                Project Time Spending
              </h1>
              <div className="border-rounded-light000 pb-8 w-full">
                <div className="text-center rounded">
                  <div
                    className="group-title border-1 border-light000 rounded relative  px-2 py-1 z-20 max-w-min min-w-44"
                    onClick={() => {
                      setOpenSelector(!openSelector)
                    }}
                  >
                    {totalProjectList[selectedProject].title}
                    {openSelector && (
                      <div className="dropdown-container z-20">
                        <ul className="dropdown-list">
                          {projectList.map((id) => {
                            const projectDetail = totalProjectList[id]
                            return (
                              <li
                                className="dropdown-item"
                                value={projectDetail.id}
                                key={projectDetail.id}
                                onClick={() => {
                                  setSelectedProject(projectDetail.id)
                                  setOpenSelector(false)
                                }}
                              >
                                {projectDetail.title}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-1/2 md:w-full">
                  <VictoryChart
                    theme={VictoryTheme.grayscale}
                    animate={{
                      duration: 2000,
                      onLoad: { duration: 1000 },
                    }}
                  >
                    <VictoryArea
                      style={{ data: { fill: "#c43a31" } }}
                      data={taskDateRange}
                    />
                  </VictoryChart>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default Report
