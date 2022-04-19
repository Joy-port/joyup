import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"
// const analytics = getAnalytics(app)

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
  auth: getAuth(app),
  db: getFirestore(app),
  getTask: async () => {},
  saveTask: async () => {
    try {
      const clockData = [
        this.db,
        this.collectionName,
        this.auth.currentUser.uid,
        "clocks",
      ]
      const userClockPosition = collection(...clockData)
      const clockList = await getDocs(userClockPosition)
      const clocks = []
      clockList.forEach(async (doc) => {
        if (!doc.data().timezone) return
        clocks.push(doc.data().timezone)
      })
      return clocks
    } catch (error) {
      console.error(error)
    }
  },
}
