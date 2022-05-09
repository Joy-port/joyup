import { create, defaultTypes, defaultTags } from "./config"
import { getTagList } from "./functions"
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
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth"
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

//test account for storage
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
  editUserSettingsTimer: async function (userID, clockSettings) {
    try {
      const collectionName = "userSettings"
      const userSettingsRef = doc(this.db, collectionName, userID)
      await updateDoc(userSettingsRef, {
        clockSettings,
      })
      alert("setting is saved successfully!")
    } catch (err) {
      console.error(err)
    }
  },
  saveUserSettingsUserName: async function (user) {
    try {
      const collectionName = "userSettings"
      const userSettingsRef = doc(this.db, collectionName, user.id)
      await updateDoc(userSettingsRef, {
        name: user.userName,
      })
      alert("user name is saved")
    } catch (error) {
      console.error(error)
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
  // getUserProjects: async function (userID) {
  //   //has problem to fix
  //   const userCollection = "userProjects"
  //   const userRef = doc(this.db, userCollection, userID)
  //   const userProjects = await getDoc(userRef)
  //   if (!userProjects.exists()) return {}
  //   const ownerProjects = userProjects.data().ownerProjects || []
  //   const collaborateProjects = userProjects.data().collaborateProjects || []
  //   return { ownerProjects, collaborateProjects }
  // },
  // createNewProject: async function (projectID, projectTitle, userID) {
  //   //when created project with defaultTags
  //   try {
  //     //create data in project collections
  //     const collectionName = "projects"
  //     const projectRef = doc(this.db, collectionName, projectID)
  //     const projectContent = {
  //       title: projectTitle,
  //       tags: [...defaultTypes],
  //       ...defaultTags,
  //     }
  //     await setDoc(projectRef, projectContent)
  //     //create data in user
  //     const userCollection = "userProjects"
  //     //project Type needed to be added
  //     // ownerProjects or  collaborateProjects
  //     const projectType = "ownerProjects"
  //     const userRef = doc(this.db, userCollection, userID)
  //     await updateDoc(userRef, {
  //       [projectType]: arrayUnion(projectID),
  //     })

  //     return projectContent
  //   } catch (err) {
  //     console.error(error)
  //   }
  // },
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
      console.log("save task", taskContent)
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
      console.log(stateId, content)
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
      // console.log(tags)
    } catch (error) {
      console.error(error)
    }
  },
  saveDefaultTagsToTags: async function () {
    const q = [this.db, "tags"]
    create.tags.forEach(async (tag) => {
      await setDoc(doc(...q, tag.id), { ...tag })
    })
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
        isPublic,
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
      if (userProjectList.data()[type].some((item) => item === projectID)) {
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
        ...create.settings,
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
  deleteProject: async function (projectID, userID) {
    try {
      const projectCollection = "projects"
      const taskCollection = "tasks"
      const projectRef = doc(this.db, projectCollection, projectID)
      const taskQuery = query(
        collection(this.db, taskCollection),
        where("projectID", "==", projectID)
      )
      console.log("delete project")
      const taskSnapShot = await getDocs(taskQuery)
      taskSnapShot.forEach(async (task) => {
        console.log(task.id)
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
  userSignUp: async function (email, password) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        if (!userCredential) throw new Error("連線錯誤，請重新注冊")
        const user = userCredential.user
        return user
      })
      .catch((error) => {
        const errMsg = error.message.split("/")[1].replace(/-/g, " ").replace(").", "")
        if (errMsg === "weak password") {
          alert("請輸入6位數字密碼")
          return
        }
        alert(errMsg)
        const errorCode = error.code
        const errorMessage = error.message
        throw new Error(errorCode, errorMessage)
      })
  },
  userSignIn: async function (email, password) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        if (!userCredential) throw new Error("連線錯誤，請重新登入")
        const user = userCredential.user
        return user
      })
      .catch((error) => {
        const errMsg = error.message.split("/")[1].replace(/-/g, " ").replace(").", "")
        alert(errMsg)
        const errorCode = error.code
        const errorMessage = error.message
        throw new Error(errorCode, errorMessage)
      })
  },
  userSignOut: async function () {
    try {
      await signOut(this.auth)
    } catch (error) {
      alert(error.message)
      const errorCode = error.code
      const errorMessage = error.message
      throw new Error(errorCode, errorMessage)
    }
  },
  // deleteProfile: function () {
  //   deleteUser(this.auth.currentUser)
  //     .then(() => {
  //       console.log("deleted")
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //     })
  // },
  userStatusChange: async function (isSignInCallBack, isSignOutCallBack) {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        isSignInCallBack(user)
      } else {
        isSignOutCallBack()
      }
    })
  },
}
