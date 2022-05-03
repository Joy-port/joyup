import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  VictoryPie,
  VictoryContainer,
  VictoryChart,
  VictoryArea,
  VictoryTheme,
  Slice,
} from "victory"
import { scaleDiscontinuous, discontinuityRange } from "@d3fc/d3fc-discontinuous-scale"

const Report = () => {
  const { userTasks } = useSelector((state) => state.user)
  const { totalTaskList, totalProjectList, projectList } = useSelector(
    (state) => state.projects
  )
  const [selectedProject, setSelectedProject] = useState("")
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

  const [taskDateRange, setTaskDateRange] = useState(() => {
    const combineTaskDate = userTaskDetail.map((task) => {
      const taskDate = {
        start: new Date(task.startDate),
        end: new Date(task.dueDate),
        x: new Date(task.startDate),
        y: task.totalTime,
      }
      return taskDate
    })
    return combineTaskDate
  })
  const discontinuousScale = scaleDiscontinuous(
    d3Scale.scaleTime()
  ).discontinuityProvider(discontinuitySkipWeekends())

  return (
    <div className="grow flex flex-col flex-wrap">
      <h1>Report</h1>
      <div className="w-1/2 text-sm">
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
                    {
                      target: "labels",
                      mutation: ({ text }) => {
                        return text === "clicked" ? null : { text: "clicked" }
                      },
                    },
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
          // scale={{ x: discontinuousScale }}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 },
          }}
          scale={{ x: discontinuousScale }}
        >
          <VictoryArea
            // categories={{ x: projectList }}
            style={{ data: { fill: "#c43a31" } }}
            data={taskDateRange}
          />
        </VictoryChart>
      </div>
    </div>
  )
}

export default Report
