import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  VictoryPie,
  VictoryContainer,
  VictoryChart,
  VictoryArea,
  VictoryTheme,
  Slice,
} from "victory"
// import {
//   scaleDiscontinuous,
//   discontinuitySkipWeekends,
// } from "@d3fc/d3fc-discontinuous-scale"
// import { scaleTime } from "d3-scale"
import { getClockTime } from "../helpers/functions"

const Report = () => {
  const { userTasks } = useSelector((state) => state.user)
  const { totalTaskList, totalProjectList, projectList } = useSelector(
    (state) => state.projects
  )
  const tags = useSelector((state) => state.tag)
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
    <div className="grow flex flex-col flex-wrap">
      <h1>Report</h1>
      <div className="w-1/2 text-sm mb-10">
        <h1>Total Time Spending</h1>
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
      <div className="w-1/2 text-sm">
        <h1>
          Project Time Spending
          <select
            value={selectedProject}
            className="ml-2"
            onChange={(e) => {
              setSelectedProject(e.target.value)
            }}
          >
            {projectList.map((projectID) => (
              <option value={projectID} key={projectID}>
                {totalProjectList[projectID].title}
              </option>
            ))}
          </select>
        </h1>
        <VictoryChart
          theme={VictoryTheme.material}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 },
          }}
        >
          <VictoryArea style={{ data: { fill: "#c43a31" } }} data={taskDateRange} />
        </VictoryChart>
      </div>
    </div>
  )
}

export default Report
