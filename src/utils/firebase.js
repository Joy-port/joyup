import { create } from "./config"
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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "joyup-management.firebaseapp.com",
  projectId: "joyup-management",
  storageBucket: "joyup-management.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const firebase = {
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
  getUserProjects: async function (userID, callback) {
    const userProjectsRef = collection(this.db, "userProjects")
    let dataObject = {}
    onSnapshot(userProjectsRef, { includeMetadataChanges: false }, (userProjectData) => {
      userProjectData.forEach((userProjectDoc) => {
        if (userProjectDoc.id === userID) {
          dataObject = { ...userProjectDoc.data() }
        }
      })
      callback(dataObject)
    })
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
  saveTagsToProjectID: async function (content) {
    const { parentTag, childTag, taskID, projectID } = content
    const collectionName = "projects"
    const projectRef = doc(this.db, collectionName, projectID)
    const projectTags = await getDoc(projectRef)
    if (!projectTags.data().tasks.some((item) => item === taskID)) {
      await updateDoc(projectRef, {
        tasks: arrayUnion(taskID),
      })
    }
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
    await updateDoc(projectRef, {
      [columnContent.id]: columnContent.taskIds,
    })
  },
  getProjectTasks: async function (projectID) {
    try {
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
    } catch (err) {
      console.error(err)
    }
  },
  saveCurrentProjectOrderType: async function (typeID, projectID) {
    try {
      const collectionName = "projects"
      const typeName = "currentType"
      const projectRef = doc(this.db, collectionName, projectID)
      await updateDoc(projectRef, {
        [typeName]: typeID,
      })
    } catch (error) {
      console.error(error)
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
    } catch (error) {
      console.error(error)
    }
  },
  duplicateTasksForNewProject: async function (projectContent) {
    try {
      const taskCollection = "tasks"
      const taskList = [...projectContent.tasks]
      const taskUpdateList = {}
      for (const task of taskList) {
        const taskQuery = doc(this.db, taskCollection, task)
        const taskDetail = await getDoc(taskQuery)
        const newTaskID = uuidv4()
        const newTaskDetail = {
          ...taskDetail.data(),
          id: newTaskID,
          projectID: projectContent.id,
        }
        const taskUpdateDetail = {
          oldID: task,
          id: newTaskID,
          tagsList: taskDetail.data().tagList,
        }
        await firebase.saveTask(newTaskDetail)
        taskUpdateList[task] = taskUpdateDetail
      }
      return taskUpdateList
    } catch (error) {
      console.error(error)
    }
  },
  duplicateProjectDetail: async function (projectDetail, taskUpdateContent) {
    try {
      const newTaskList = projectDetail.tasks.map((taskID) => {
        taskUpdateContent[taskID].oldID === taskID
        return taskUpdateContent[taskID].id
      })
      const totalTags = []
      for (const tagsType of projectDetail.tags) {
        totalTags.push(...projectDetail[tagsType])
      }
      const projectTagsOrderUpdate = {}
      for (const tagID of totalTags) {
        const newOrder = projectDetail[tagID].map((taskID) => {
          taskUpdateContent[taskID].oldID === taskID
          return taskUpdateContent[taskID].id
        })
        projectTagsOrderUpdate[tagID] = newOrder
      }

      const newProjectDetail = {
        ...projectDetail,
        ...projectTagsOrderUpdate,
        tasks: newTaskList,
      }
      return newProjectDetail
    } catch (error) {
      console.error(error)
    }
  },
  createProjectWithTemplate: async function (projectContent, userID) {
    try {
      const collectionName = "projects"
      const projectID = projectContent.id
      await setDoc(doc(this.db, collectionName, projectID), {
        ...projectContent,
        id: projectID,
      })
      const userProjectCollection = "userProjects"
      const userProjectsRef = doc(this.db, userProjectCollection, userID)
      await updateDoc(userProjectsRef, {
        ownerProjects: arrayUnion(projectID),
      })
      return projectID
    } catch (error) {
      console.error(error)
    }
  },
  createProjectWithDefaultTags: async function (title, userID, isPublic) {
    try {
      const users = [userID]
      const collectionName = "projects"
      const projectRef = doc(collection(this.db, collectionName))
      const projectID = projectRef.id
      await setDoc(doc(this.db, collectionName, projectID), {
        ...create.project,
        title,
        users,
        id: projectID,
        isPublic: isPublic,
        isTemplate: 0,
      })
      const userProjectCollection = "userProjects"
      const userProjectsRef = doc(this.db, userProjectCollection, userID)
      await updateDoc(userProjectsRef, {
        ownerProjects: arrayUnion(projectID),
      })
      return projectID
    } catch (err) {
      console.error(err)
    }
  },
  saveProjectToUserProjects: async function (userID, projectID, type) {
    try {
      const collectionName = "userProjects"
      const projectRef = doc(this.db, collectionName, userID)
      const userProjectList = await getDoc(projectRef)
      if (!userProjectList.data()[type].some((item) => item === projectID)) {
        await updateDoc(projectRef, {
          [type]: arrayUnion(projectID),
        })
      }
    } catch (error) {
      console.error(error)
    }
  },
  createUserSettingsAndProjectList: async function (userID, name) {
    try {
      const settingsCollection = "userSettings"
      const settingsRef = doc(this.db, settingsCollection, userID)
      await setDoc(settingsRef, {
        id: userID,
        name,
      })
      const projectCollection = "userProjects"
      const projectsRef = doc(this.db, projectCollection, userID)
      await setDoc(projectsRef, {
        ...create.userProjectList,
        id: userID,
      })
    } catch (error) {
      console.error(error)
    }
  },
  editProjectTitle: async function (projectID, title) {
    try {
      const projectCollection = "projects"
      const projectRef = doc(this.db, projectCollection, projectID)
      await updateDoc(projectRef, {
        title,
      })
    } catch (error) {
      console.error(error)
    }
  },
  deleteProject: async function (projectID, userID) {
    try {
      const projectCollection = "projects"
      const taskCollection = "tasks"
      const projectRef = doc(this.db, projectCollection, projectID)
      const taskQuery = query(
        collection(this.db, taskCollection),
        where("projectID", "==", projectID)
      )
      const taskSnapShot = await getDocs(taskQuery)
      taskSnapShot.forEach(async (task) => {
        if (task.id) {
          await deleteDoc(doc(this.db, taskCollection, task.id))
        }
      })
      const projectDetail = await getDoc(projectRef)
      const type =
        projectDetail.data().isPublic === 0 ? "ownerProjects" : "collaborateProjects"
      const userCollection = "userProjects"
      const userRef = doc(this.db, userCollection, userID)
      await updateDoc(userRef, {
        [type]: arrayRemove(projectID),
      })
      await deleteDoc(projectRef)
    } catch (error) {
      console.error(error)
    }
  },
}
export const login = {
  auth: getAuth(app),
  userSignUp: async function (email, password, callback) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        if (!userCredential) {
          callback && callback("connect error, please try again")
          return
        }
        const user = userCredential.user
        return user
      })
      .catch((error) => {
        const errMsg = error.message.split("/")[1].replace(/-/g, " ").replace(").", "")
        callback && callback(errMsg)
        const errorCode = error.code
        const errorMessage = error.message
        throw new Error(errorCode, errorMessage)
      })
  },
  userSignIn: async function (email, password, callback) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        if (!userCredential) {
          callback && callback("connect error, please try again")
          return
        }
        const user = userCredential.user
        return user
      })
      .catch((error) => {
        const errMsg = error.message.split("/")[1].replace(/-/g, " ").replace(").", "")
        callback && callback(errMsg)
        const errorCode = error.code
        const errorMessage = error.message
        throw new Error(errorCode, errorMessage)
      })
  },
  userSignOut: async function (callback) {
    try {
      await signOut(this.auth)
    } catch (error) {
      const errMsg = error.message.split("/")[1].replace(/-/g, " ").replace(").", "")
      callback && callback(errMsg)
      const errorCode = error.code
      const errorMessage = error.message
      throw new Error(errorCode, errorMessage)
    }
  },
}
