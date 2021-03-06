import React from "react"
import { any } from "prop-types"
import { useAuthState } from "react-firebase-hooks/auth"
import { login } from "../utils/firebase"

export const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const loadingStatus = useAuthState(login.auth, login.auth.User)
  return <AuthContext.Provider value={loadingStatus}>{children}</AuthContext.Provider>
}
AuthProvider.propTypes = {
  children: any.isRequired,
}

export default AuthProvider
