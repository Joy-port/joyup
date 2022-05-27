export const getClockTime = (time) => {
  let hours = "00"
  let minutes = "00"
  let seconds = "00"
  if (time < 60) {
    seconds = time
    seconds = seconds < 10 ? `0${seconds}` : seconds
  } else if (time > 60 && time < 3600) {
    minutes = Math.floor(time / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = (time - minutes * 60) % 60
    seconds = seconds < 10 ? `0${seconds}` : seconds
  } else if (time > 3600) {
    hours = Math.floor(time / 3600)
    hours = hours < 10 ? `0${hours}` : hours
    minutes = Math.floor((time - hours * 3600) / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = (time - hours * 3600 - minutes * 60) / 60
    seconds = seconds < 10 ? `0${seconds}` : seconds
  }
  return `${hours}:${minutes}:${seconds}`
}
export const getHourTime = (time) => {
  let hours = "00"
  let minutes = "00"
  let seconds = "00"
  if (time === 0) {
    return 0
  } else if (time < 60) {
    seconds = time
    // seconds = seconds < 10 ? `0${seconds}` : seconds
    return `${seconds} s`
  } else if (time > 60 && time < 3600) {
    minutes = Math.floor(time / 60)
    // minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = (time - minutes * 60) % 60
    // seconds = seconds < 10 ? `0${seconds}` : seconds
    return `${minutes} min ${seconds} s`
  } else if (time > 3600) {
    hours = Math.floor(time / 3600)
    // hours = hours < 10 ? `0${hours}` : hours
    minutes = Math.floor((time - hours * 3600) / 60)
    // minutes = minutes < 10 ? `0${minutes}` : minutes
    // seconds = (time - hours * 3600 - minutes * 60) / 60
    // seconds = seconds < 10 ? `0${seconds}` : seconds
    return `${hours} hrs ${minutes} min`
  }
  // return `${hours}:${minutes}:${seconds}`
}

export const dayRangeFromToday = (day) => {
  const rangeFromToday =
    new Date().getDay() < day ? day - new Date().getDay() : 7 - new Date().getDay() + day
  return rangeFromToday
}
export const getDateFromToday = (numberAwayFromToday) => {
  return new Date(
    new Date().setDate(new Date().getDate() + numberAwayFromToday)
  ).getTime()
}

export function filterSelectedTypeTags(
  selectedProject,
  selectedType,
  totalTagList,
  totalTaskList,
  totalProjectList
) {
  const selectedColumns = {}
  const selectedTasks = []
  const currentProject = totalProjectList[selectedProject]
  currentProject[selectedType].forEach((tagID) => {
    selectedColumns[tagID] = {
      id: tagID,
      title: totalTagList[tagID].name,
      taskIds: currentProject[tagID] || [],
    }
    currentProject[tagID].forEach((taskid) => {
      if (totalTaskList[taskid]) {
        selectedTasks.push(totalTaskList[taskid])
      }
    })
  })

  return [selectedColumns, selectedTasks]
}

export function getTagList(defaultTagList) {
  const tagsGroup = []
  defaultTagList.forEach(async (doc) => {
    if (doc.data().parent === "") {
      const parentTags = {
        id: doc.id,
        type: doc.data().name,
        children: [],
      }
      tagsGroup.push(parentTags)
    }
  })
  defaultTagList.forEach(async (doc) => {
    if (doc.data().parent !== "" && doc.data().parent !== "all") {
      const childTags = {
        id: doc.id,
        name: doc.data().name,
      }
      tagsGroup
        .find((parents) => parents.id === doc.data().parent)
        .children.splice(doc.data().index, 0, childTags)
    }
  })
  defaultTagList.forEach(async (doc) => {
    if (doc.data().parent === "all") {
      const childTag = {
        id: doc.id,
        name: doc.data().name,
      }
      tagsGroup.map((item) => {
        item.children.unshift(childTag)
      })
    }
  })
  return tagsGroup
}
export function getCalendarTime(timeInNanoSeconds) {
  return new Date(timeInNanoSeconds)
}

export const filterCommandListByQuery = (queryType, commandList) => {
  return commandList.filter((command) =>
    command.name.toLowerCase().match(queryType.toLowerCase())
  )
}
