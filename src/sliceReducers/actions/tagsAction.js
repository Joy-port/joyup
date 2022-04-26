import { firebase } from "../../helpers/firebase"

export const tagsAction = {
  projects: "projects",
  tags: "tags",
  getProjects: function () {
    return async function (dispatch, getState) {
      try {
        await firebase.getRealTimeData(this.projects, (projects) => {
          dispatch({ type: "projects/updateProjects", payload: projects })
        })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  getTags: function () {
    return async function (dispatch, getState) {
      try {
        await firebase.getRealTimeData(this.tags, (tags) => {
          dispatch({ type: "tags/updateTagsDetail", payload: tags })
        })
      } catch (err) {
        dispatch({ type: "ERROR", payload: err })
      }
    }
  },
}
