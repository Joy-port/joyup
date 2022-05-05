import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
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
import { getClockTime } from "../helpers/functions"

const Report = () => {
  const [openSelector, setOpenSelector] = useState(false)
  const { userTasks } = useSelector((state) => state.user)
  const { totalTaskList, totalProjectList, projectList } = useSelector(
    (state) => state.projects
  )
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
      const taskProject = totalProjectList[task.projectID]
      if (!total[taskProject.id]) {
        total[taskProject.id] = {
          id: taskProject.id,
          x: taskProject.title,
          y: task.totalTime,
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
    }, {})
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
          y: parseFloat(getClockTime(task.totalTime).split(":")[0]) || 0,
          y0: parseFloat(getClockTime(task.totalTime).split(":")[1]) / 60,
        }
        return taskDate
      })
      .sort((a, b) => a.x - b.x)
    return combineTaskDate
  })
  const [taskDateRange, setTaskDateRange] = useState(() => {
    const data = switchProjectTasks()
    console.log(data)
    return data
  })

  useEffect(() => {
    setTaskDateRange(() => {
      const data = switchProjectTasks()
      return data
    })
  }, [selectedProject])

  return (
    <>
      <div className="menu-container">
        <div className="heading-four font-medium">Time Spending</div>
      </div>
      <div className="-mt-5 min-h-18 mb-3"></div>

      <div className="grow flex flex-col flex-wrap">
        <div className="w-1/2 text-sm mb-10">
          <h1 className="tag-light200 w-56 px-2 py-1 text-center">Total Time Spending</h1>
          {Object.values(taskPie).length === 0 && (
            <div className="border-rounded-light000">
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
        <div className="text-sm">
          <h1 className="tag-light200 w-56 px-2 py-1 text-center">
            Project Time Spending
          </h1>
          <div className="border-rounded-light000 w-full">
            <div className="text-center rounded">
              <div
                className="group-title border-1 border-light000 rounded relative w-44 px-2 py-1"
                onClick={() => {
                  setOpenSelector(!openSelector)
                }}
              >
                Project: {totalProjectList[selectedProject].title}
                {openSelector && (
                  <div className="dropdown-container">
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
            <div className="w-1/2">
              {taskDateRange.length === 0 && (
                <VictoryChart
                  theme={VictoryTheme.material}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Report
