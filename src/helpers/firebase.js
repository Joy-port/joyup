import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics"
// const analytics = getAnalytics(app)

//joyup
const firebaseConfig = {
  apiKey: "AIzaSyAiunsJAkpLkmy1Fg5FOLjYIct1Q-SXzCM",
  authDomain: "joyup-managment.firebaseapp.com",
  projectId: "joyup-managment",
  storageBucket: "joyup-managment.appspot.com",
  messagingSenderId: "213014992466",
  appId: "1:213014992466:web:71dd4fcc93b1bb98db718b",
  measurementId: "G-X689NX3J9C",
}

//test account
// const firebaseConfig = {
//   apiKey: "AIzaSyAn2Rn0KtkKJi1OMuj1NLMHE6ojyeMRUvk",
//   authDomain: "designworks-project.firebaseapp.com",
//   projectId: "designworks-project",
//   storageBucket: "designworks-project.appspot.com",
//   messagingSenderId: "773350951759",
//   appId: "1:773350951759:web:b30f70ffe1d872adbe133a",
//   measurementId: "G-4KNVP5V95N",
// }

const app = initializeApp(firebaseConfig)

export const firebase = {
  // auth: getAuth(app),
  db: getFirestore(app),
  getTags: async () => {
    try {
    } catch (err) {
      console.error(err)
    }
  },
  getProjectTags: async function () {
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
            child: [],
          }
          tagsGroup.push(parentTags)
        } else {
          const child = {
            id: doc.id,
            name: doc.data().name,
          }
          tagsGroup
            .find((parents) => parents.id === doc.data().parent)
            .child.splice(doc.data().index, 0, child)
        }
      })
      return tagsGroup
    } catch (error) {
      console.error(error)
    }
  },
}
