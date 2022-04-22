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

export const firebase = {
  // auth: getAuth(app),
  db: getFirestore(app),
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
        requiredNumber: state.requiredClockNumber,
        createdDate: state.createdDate,
        dueDate: state.dueDate,
        startDate: state.startDate,
        location: state.location,
        id: state.id,
        projectID: state.projectID,
        totalTime: state.totalTime,
        tags: state.tags,
      }

      await setDoc(doc(this.db, collectionName, state.id), taskData)
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
      const eachLinePosition = doc(...taskIdDescription, line.id)
      await setDoc(eachLinePosition, line)
    })
  },
  saveTaskPartialContent: async function (stateId, content) {
    try {
      const collectionName = "tasks"
      const taskContentRef = [this.db, collectionName, stateId]
      await setDoc(doc(...taskContentRef), { ...content })
    } catch (error) {
      console.error(error)
    }
  },
}
