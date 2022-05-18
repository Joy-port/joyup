import { any } from "prop-types"
import React, { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { login } from "../utils/firebase"

export const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const loadingStatus = useAuthState(login.auth, login.auth.User)
  // console.log("%c check login ", "color:#A12341", loadingStatus)
  return <AuthContext.Provider value={loadingStatus}>{children}</AuthContext.Provider>
}
AuthProvider.propTypes = {
  children: any.isRequired,
}

export default AuthProvider
