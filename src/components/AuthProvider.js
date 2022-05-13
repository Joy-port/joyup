import { any } from "prop-types"
import React, { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { login } from "../helpers/firebase"

export const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const loadingStatus = useAuthState(login.auth, login.auth.User)
  useEffect(() => {
    console.log(loadingStatus)
    //uid: "VI3mUOQiM2RrYYvNagMuQU4fLgm1"
  }, [])
  return <AuthContext.Provider value={loadingStatus}>{children}</AuthContext.Provider>
}
AuthProvider.propTypes = {
  children: any.isRequired,
}

export default AuthProvider
