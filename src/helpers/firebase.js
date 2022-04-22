import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  getDoc,
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
export const firebase = {
  // auth: getAuth(app),
  db: getFirestore(app),
  getProjectTasks: async function (projectID) {
    console.log(projectID)
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
        tags: data.tags,
      }
      totalTasks.push(requiredData)
    })
    return totalTasks
  },
  getDefaultTags: async function () {
    try {
      const collectionName = "tags"
      const tagsData = collection(this.db, collectionName)
      const q = query(tagsData, where("createdBy", "==", "0"))
      const defaultTagList = await getDocs(q)
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
        if (doc.data().parent !== "") {
          const childTags = {
            id: doc.id,
            name: doc.data().name,
          }
          tagsGroup
            .find((parents) => parents.id === doc.data().parent)
            .children.splice(doc.data().index, 0, childTags)
        }
      })
      return tagsGroup
    } catch (error) {
      console.error(error)
    }
  },
  saveTask: async function (state) {
    try {
      const collectionName = "tasks"
      const taskData = {
        title: state.title,
        requiredNumber: state.requiredNumber,
        createdDate: state.createdDate,
        dueDate: state.dueDate,
        startDate: state.startDate,
        location: state.location,
        id: state.id,
        projectID: state.projectID,
        totalTime: state.totalTime,
        tags: state.tags,
      }
      if (state.id) {
        await setDoc(doc(this.db, collectionName, state.id), taskData)
      }
    } catch (err) {
      console.error(err)
    }
  },
  saveDescription: async function (state) {
    const collectionName = "tasks"
    const subCollectionName = "descriptions"
    const taskIdDescription = [this.db, collectionName, state.id, subCollectionName]
    const { description } = state
    description.forEach(async (line) => {
      console.log(line)
      const eachLinePosition = doc(...taskIdDescription, line.id)
      await setDoc(eachLinePosition, line)
    })
  },
  saveTaskPartialContent: async function (stateId, content) {
    try {
      const collectionName = "tasks"
      const taskContentRef = [this.db, collectionName, stateId]
      const taskHasSavedInDataBase = await getDoc(doc(...taskContentRef))
      if (taskHasSavedInDataBase.exists()) {
        console.log(taskHasSavedInDataBase.data())
        await updateDoc(doc(...taskContentRef), { ...content })
      }
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
