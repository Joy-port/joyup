import { async } from "@firebase/util"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  arrayUnion,
  onSnapshot,
  arrayRemove,
} from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics"
// const analytics = getAnalytics(app)

//joyup
// const firebaseConfig = {
//   apiKey: "AIzaSyAiunsJAkpLkmy1Fg5FOLjYIct1Q-SXzCM",
//   authDomain: "joyup-managment.firebaseapp.com",
//   projectId: "joyup-managment",
//   storageBucket: "joyup-managment.appspot.com",
//   messagingSenderId: "213014992466",
//   appId: "1:213014992466:web:71dd4fcc93b1bb98db718b",
//   measurementId: "G-X689NX3J9C",
// }

//test account
const firebaseConfig = {
  apiKey: "AIzaSyAn2Rn0KtkKJi1OMuj1NLMHE6ojyeMRUvk",
  authDomain: "designworks-project.firebaseapp.com",
  projectId: "designworks-project",
  storageBucket: "designworks-project.appspot.com",
  messagingSenderId: "773350951759",
  appId: "1:773350951759:web:b30f70ffe1d872adbe133a",
  measurementId: "G-4KNVP5V95N",
}

const app = initializeApp(firebaseConfig)
const defaultTags = [
  {
    createdBy: "0",
    id: "7qzOkGy3a0F6kgDqu5ma",
    index: 0,
    name: "to do",
    parent: "Y3ScZ3EP9hhO7PB0EkJU",
    projectID: "",
    type: "progress",
  },
  {
    createdBy: "0",
    id: "BjCJ9brvUXkru0jJYZ6c",
    index: -1,
    name: "priority",
    parent: "",
    projectID: [""],
    type: "priority",
  },
  {
    createdBy: "0",
    id: "LqoN88hEwKS5ttU283yU",
    index: 1,
    name: "high",
    parent: "BjCJ9brvUXkru0jJYZ6c",
    projectID: "",
    type: "priority",
  },
  {
    createdBy: "0",
    id: "Y3ScZ3EP9hhO7PB0EkJU",
    index: -1,
    name: "progress",
    parent: "",
    projectID: [""],
    type: "progress",
  },
  {
    createdBy: "0",
    id: "ZT9kq2hhregSKPmVcEHh",
    index: 2,
    name: "normal",
    parent: "BjCJ9brvUXkru0jJYZ6c",
    projectID: "",
    type: "priority",
  },
  {
    createdBy: "0",
    id: "b0htJEJVP9noZU8Tx200",
    index: 2,
    name: "done",
    parent: "Y3ScZ3EP9hhO7PB0EkJU",
    projectID: "",
    type: "progress",
  },
  {
    createdBy: "0",
    id: "hH5M4VZKHGyheC4QID2n",
    index: 0,
    name: "urgent",
    parent: "BjCJ9brvUXkru0jJYZ6c",
    projectID: "",
    type: "priority",
  },
  {
    createdBy: "0",
    id: "mkPSjbSrFD7ert0HosMg",
    index: 1,
    name: "in progress",
    parent: "Y3ScZ3EP9hhO7PB0EkJU",
    projectID: "",
    type: "progress",
  },
  {
    createdBy: "0",
    id: "yEFXbvDC5slJxmMVOp3D",
    index: 3,
    name: "low",
    parent: "BjCJ9brvUXkru0jJYZ6c",
    projectID: "",
    type: "priority",
  },
]
const defaultParentID = ["BjCJ9brvUXkru0jJYZ6c", "Y3ScZ3EP9hhO7PB0EkJU"]
const defaultChildren = {
  BjCJ9brvUXkru0jJYZ6c: [
    "LqoN88hEwKS5ttU283yU",
    "ZT9kq2hhregSKPmVcEHh",
    "hH5M4VZKHGyheC4QID2n",
    "yEFXbvDC5slJxmMVOp3D",
  ],
  Y3ScZ3EP9hhO7PB0EkJU: [
    "7qzOkGy3a0F6kgDqu5ma",
    "b0htJEJVP9noZU8Tx200",
    "mkPSjbSrFD7ert0HosMg",
  ],
}
export const firebase = {
  // auth: getAuth(app),
  db: getFirestore(app),
  getRealTimeData: async function (collectionName, callback) {
    const projectRef = collection(this.db, collectionName)
    const dataObject = {}
    onSnapshot(projectRef, { includeMetadataChanges: false }, (projectCollections) => {
      projectCollections.forEach((project) => {
        dataObject[project.id] = project.data()
      })
      callback(dataObject)
    })
  },
  getUserSettings: async function (userID) {
    try {
      const collectionName = "userSettings"
      const userSettingsRef = doc(this.db, collectionName, userID)
      const userDoc = await getDoc(userSettingsRef)
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return ""
    } catch (err) {
      console.error(err)
    }
  },
  editUserSettingsTimer: async function (userID, clockSettings) {
    try {
      const collectionName = "userSettings"
      const userSettingsRef = doc(this.db, collectionName, userID)
      await updateDoc(userSettingsRef, {
        clockSettings,
      })
    } catch (err) {
      console.error(err)
    }
  },
  getTotalProjects: async function () {
    const collectionName = "projects"
    const projectRef = collection(this.db, collectionName)
    const totalProjects = []
    const projectSnapshot = await getDocs(projectRef)
    projectSnapshot.forEach((item) => {
      totalProjects.push(item.data())
    })
    return totalProjects
  },
  getUserProjects: async function (userID) {
    //has problem to fix
    const userCollection = "userProjects"
    const userRef = doc(this.db, userCollection, userID)
    const userProjects = await getDoc(userRef)
    if (!userProjects.exists()) return {}
    const ownerProjects = userProjects.data().ownerProjects || []
    const collaborateProjects = userProjects.data().collaborateProjects || []
    return { ownerProjects, collaborateProjects }
  },
  createNewProject: async function (projectID, projectTitle, userID) {
    //when created project with defaultTags
    try {
      //create data in project collections
      const collectionName = "projects"
      const projectRef = doc(this.db, collectionName, projectID)
      const projectContent = {
        title: projectTitle,
        tags: [...defaultParentID],
        ...defaultChildren,
      }
      await setDoc(projectRef, projectContent)
      //create data in user
      const userCollection = "userProjects"
      //project Type needed to be added
      // ownerProjects or  collaborateProjects
      const projectType = "ownerProjects"
      const userRef = doc(this.db, userCollection, userID)
      await updateDoc(userRef, {
        [projectType]: arrayUnion(projectID),
      })

      return projectContent
    } catch (err) {
      console.error(error)
    }
  },
  saveTagsToProjectID: async function (content) {
    const { parentTag, childTag, taskID, projectID } = content
    const collectionName = "projects"
    const projectRef = doc(this.db, collectionName, projectID)
    const projectTags = await getDoc(projectRef)
    //add if new create
    if (!projectTags.data().tasks.some((item) => item === taskID)) {
      await updateDoc(projectRef, {
        tasks: arrayUnion(taskID),
      })
    }
    //delete previous
    const tagList = [...projectTags.data()[parentTag]]
    const prevTag = tagList.find((tagID) => {
      const hasTask = projectTags.data()[tagID].find((task) => task === taskID)
      if (hasTask) return tagID
      return ""
    })
    if (prevTag !== "") {
      await updateDoc(projectRef, {
        [prevTag]: arrayRemove(taskID),
      })
    }
    //add to new
    if (!projectTags.data()[childTag]) {
      await updateDoc(projectRef, {
        [childTag]: [],
      })
    }
    await updateDoc(projectRef, {
      [childTag]: arrayUnion(taskID),
    })
  },
  saveTaskOrder: async function (projectID, columnContent) {
    const collectionName = "projects"
    const projectRef = doc(this.db, collectionName, projectID)
    // const projectDoc = await getDoc(projectRef)
    await updateDoc(projectRef, {
      [columnContent.id]: columnContent.taskIds,
    })
  },
  getProjectTasks: async function (projectID) {
    const collectionName = "tasks"
    const q = query(
      collection(this.db, collectionName),
      where("projectID", "==", projectID)
    )
    const totalTaskSnapshot = await getDocs(q)
    const totalTasks = []
    totalTaskSnapshot.forEach((doc) => {
      const data = {
        ...doc.data(),
      }
      const requiredData = {
        title: data.title,
        id: doc.id,
        projectID: data.projectID,
        tagList: data.tagList,
      }
      totalTasks.push(requiredData)
    })
    return totalTasks
  },
  getTagColumnRelatedTaskIds: async function (projectID, columnIDs) {
    const collectionName = "projects"
    const projectRef = doc(this.db, collectionName, projectID)
    const projectTags = await getDoc(projectRef)
    const columnTaskIds = {}
    columnIDs.forEach((column) => {
      const columnContent = {
        taskIds: projectTags.data()[column.id],
      }
      columnTaskIds[column.id] = columnContent
    })
    return columnTaskIds
  },
  getDefaultTags: async function (projectID) {
    try {
      const collectionName = "tags"
      const tagsData = collection(this.db, collectionName)
      const q = query(tagsData, where("createdBy", "==", "0"))
      const qProject = query(tagsData, where("projectID", "==", projectID))
      const defaultTagList = await getDocs(q)
      const projectTagList = await getDocs(q)
      const defaultTags = getTagList(defaultTagList)
      const customTags = getTagList(projectTagList)
      if (customTags !== []) defaultTags.concat(customTags)
      return defaultTags
    } catch (error) {
      console.error(error)
    }
  },
  getProjectTags: async function (projectID) {
    try {
      const collectionName = "projects"
      const projectRef = doc(this.db, collectionName, projectID)
      const projectTagsDocument = await getDoc(projectRef)
      return { ...projectTagsDocument.data() }
    } catch (err) {
      console.error(err)
    }
  },
  saveTask: async function (taskContent) {
    try {
      const collectionName = "tasks"
      const taskRef = doc(this.db, collectionName, taskContent.id)
      const taskDoc = await getDoc(taskRef)
      if (!taskDoc.exists()) {
        await setDoc(taskRef, { ...taskContent })
      } else {
        await updateDoc(taskRef, { ...taskContent })
      }
    } catch (err) {
      console.error(err)
    }
  },
  // saveDescription: async function (state) {
  //   const collectionName = "tasks"
  //   const subCollectionName = "descriptions"
  //   const taskIdDescription = [this.db, collectionName, state.id, subCollectionName]
  //   const { description } = state
  //   description.forEach(async (line) => {
  //     const eachLinePosition = doc(...taskIdDescription, line.id)
  //     await setDoc(eachLinePosition, line)
  //   })
  // },
  saveTaskPartialContent: async function (stateId, content) {
    try {
      const collectionName = "tasks"
      const taskContentRef = [this.db, collectionName, stateId]
      const taskHasSavedInDataBase = await getDoc(doc(...taskContentRef))
      if (taskHasSavedInDataBase.exists()) {
        await updateDoc(doc(...taskContentRef), { ...content })
      }
    } catch (error) {
      console.error(error)
    }
  },
  saveTaskTags: async function (tagContent) {
    try {
      const collectionName = "tasks"
      const taskContentRef = [this.db, collectionName, tagContent.taskId]
      const tag = { ...tagContent }
      delete tag.taskId
      const taskContent = await getDoc(doc(...taskContentRef))
      const prevTagContent = taskContent.data().tagList
      if (prevTagContent.some((item) => item.parent === tag.parent)) {
        const newTagContent = prevTagContent.filter((item) => item.parent !== tag.parent)
        newTagContent.push(tag)
        await updateDoc(doc(...taskContentRef), { tagList: newTagContent })
      } else {
        await updateDoc(doc(...taskContentRef), { tagList: arrayUnion(tag) })
      }
    } catch (err) {
      console.error(err)
    }
  },
  deleteTaskFromTaskAndProjects: async function (taskID, projectID, tagList) {
    try {
      console.log(taskID, projectID, tagList)
      const collectionName = "tasks"
      const projectCollection = "projects"
      const taskRef = doc(this.db, collectionName, taskID)
      await deleteDoc(taskRef)

      const projectRef = doc(this.db, projectCollection, projectID)

      const projectData = await getDoc(projectRef)

      await updateDoc(projectRef, {
        tasks: arrayRemove(taskID),
      })
      const tags = tagList.reduce((total, current) => {
        total.push(current.child)
        return total
      }, [])
      tags.forEach(async (tagID) => {
        await updateDoc(projectRef, {
          [tagID]: arrayRemove(taskID),
        })
      })
      console.log(tags)
    } catch (error) {
      console.error(error)
    }
  },
  // saveDefaultTags: async function () {
  //   const q = [this.db, "tags"]
  //   defaultTags.forEach(async (tag) => {
  //     await setDoc(doc(...q, tag.id), { ...tag })
  //   })
  // },
}

function getTagList(defaultTagList) {
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
