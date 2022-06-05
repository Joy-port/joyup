import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import * as Icon from "react-feather"
import { user } from "../store/actions/user"
import { AuthContext } from "../components/AuthProvider"
import Loader from "../components/Loader"
import { checkLoginMessage } from "../utils/config"
import logo from "../assets/images/logo/primary/logo_transparent.png"
import backgroundImage from "../assets/illustrations/Life Management.png"

const Login = () => {
  const { id } = useSelector((state) => state.user)
  const [userDetail, loading, _] = useContext(AuthContext)
  const [email, setEmail] = useState("joy3124@gmail.com")
  const [password, setPassword] = useState("111111")
  const [name, setName] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [nameStatus, setNameStatus] = useState(2)
  const [nameMessage, setNameMessage] = useState("")
  const [emailStatus, setEmailStatus] = useState(2)
  const [emailMessage, setEmailMessage] = useState("")
  const [passwordStatus, setPasswordStatus] = useState(2)
  const [passwordMessage, setPasswordMessage] = useState("")
  const isLoginPath = pathname === "/signin"
  useEffect(() => {
    if (loading) return
    if (userDetail && id !== "") {
      dispatch({ type: "user/getUserID", payload: userDetail.uid })
      if (isLoginPath) {
        navigate("/projects")
      }
      if (!isLoginPath) {
        dispatch({ type: "modals/switchCreateProjectModal", payload: true })
        dispatch({ type: "user/setIsFirstTimeUser", payload: true })
        navigate("/projects")
      }
    }
    return
  }, [userDetail, id])
  useEffect(() => {
    setNameStatus(2)
    setEmailStatus(2)
    setPasswordStatus(2)
  }, [isLoginPath])

  const onSubmit = (e) => {
    e.preventDefault()
    checkEmail(email)
    checkName(name)
    checkPassword(password)
    if (isLoginPath) {
      if (!checkEmail(email) || !checkPassword(password)) return
    } else {
      if (!checkEmail(email) || !checkName(name) || !checkPassword(password)) return
    }
    if (isLoginPath) {
      dispatch(user.nativeLogin(email, password))
    } else {
      dispatch(user.nativeSignUp(email, password, name))
    }
  }
  const checkEmail = useCallback((userEmail) => {
    const reg = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    if (!userEmail.trim()) {
      setEmailStatus(0)
      setEmailMessage(checkLoginMessage.email.required)
      return false
    } else if (!userEmail.toLowerCase().match(reg)) {
      setEmailStatus(0)
      setEmailMessage(checkLoginMessage.email.error)
      return false
    } else {
      setEmailStatus(2)
      setEmailMessage("")
      return true
    }
  })
  const checkName = useCallback((userName) => {
    if (!userName.trim()) {
      setNameStatus(0)
      setNameMessage(checkLoginMessage.name.required)
      return false
    } else {
      setNameStatus(2)
      setNameMessage("")
      return true
    }
  })
  const checkPassword = useCallback((userPassword) => {
    if (!userPassword.trim()) {
      setPasswordStatus(0)
      setPasswordMessage(checkLoginMessage.password.required)
      return false
    } else if (userPassword.length < 6) {
      setPasswordStatus(0)
      setPasswordMessage(checkLoginMessage.password.lengthError)
      return false
    } else {
      setPasswordStatus(2)
      setPasswordMessage("")
      return true
    }
  })
  return (
    <Fragment>
      <div className="text-slateLight h-screen ">
        <div className="py-6 px-5">
          <div className="flex items-center">
            <img src={logo} alt="JoyUp logo" className="max-w-full block h-14" />
            <p className="font-sans font-bold text-2xl">JoyUp</p>
          </div>
          <code className="ml-4 text-sm text-transparentDark">
            brighten your life with a better life management
          </code>
        </div>
        {loading ? (
          <Loader isContent={false} />
        ) : (
          <div className="flex flex-col justify-center items-center my-0 h-full px-5 -mt-32 pt-32">
            <div className="px-14 md:px-24 py-12 w-full md:w-128 bg-white rounded-lg shadow-lg shadow-blue100 border-1 border-light200 flex flex-col gap-6">
              <h1 className="heading-two text-center">
                {" "}
                {isLoginPath ? "Welcome back!" : "Let's go!"}{" "}
              </h1>
              <form onSubmit={onSubmit} className="flex flex-col gap-2">
                {!isLoginPath && (
                  <div className="w-full">
                    <label htmlFor="name" className="text-sm mb-1 block">
                      Full Name
                    </label>
                    <div
                      className={`flex gap-3 items-center mb-1 ${
                        nameStatus === 2
                          ? "text-light200"
                          : nameStatus === 1
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      <Icon.User />
                      <input
                        type="text"
                        className={`rounded-lg grow 
                         text-transparentDark border-1 border-light200 focus:outline-1 py-2 px-3 ${
                           nameStatus === 2
                             ? "  focus:caret-light200 focus:outline-light200"
                             : nameStatus === 1
                             ? "  focus:caret-success focus:outline-success"
                             : " focus:caret-danger focus:outline-danger"
                         } `}
                        value={name}
                        onChange={(e) => {
                          checkName(e.target.value)
                          setName(e.target.value)
                        }}
                      />
                    </div>
                    <div
                      className={`text-sm flex gap-2 items-center h-5 ${
                        nameStatus !== 2 ? "visible" : "invisible"
                      } ${nameStatus ? "text-success" : "text-danger "}`}
                      style={{ paddingTop: 2, paddingBottom: 2 }}
                    >
                      {nameStatus === 0 ? (
                        <Icon.AlertTriangle size={16} />
                      ) : (
                        <Icon.CheckCircle size={16} />
                      )}
                      <div className="text-sm">
                        {nameMessage}
                        <span className="invisible">123</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="w-full">
                  <label htmlFor="email" className="text-sm mb-1 block">
                    Email
                  </label>
                  <div className=" flex gap-3 items-center text-light200 mb-1 ">
                    <Icon.Mail />
                    <input
                      type="email"
                      className={`rounded-lg grow 
                         text-transparentDark border-1 border-light200 focus:outline-1 py-2 px-3 ${
                           emailStatus === 2
                             ? "focus:caret-light200 focus:outline-light200"
                             : emailStatus === 1
                             ? "focus:caret-success focus:outline-success"
                             : "focus:caret-danger focus:outline-danger"
                         } `}
                      value={email}
                      onChange={(e) => {
                        checkEmail(e.target.value)
                        setEmail(e.target.value)
                      }}
                    />
                  </div>
                  <div
                    className={`text-sm flex gap-2 items-center h-5 leading-5 ${
                      emailStatus !== 2 ? "visible" : "invisible"
                    } ${emailStatus ? "text-success" : "text-danger "}`}
                  >
                    {emailStatus === 0 ? (
                      <Icon.AlertTriangle size={16} />
                    ) : (
                      <Icon.CheckCircle size={16} />
                    )}
                    <p className="text-sm">
                      {emailMessage}
                      <span className="invisible">123</span>
                    </p>
                  </div>
                </div>
                <div className="w-full mb-5">
                  <label htmlFor="password" className="text-sm mb-1 block">
                    Password
                  </label>
                  <div className=" flex gap-3 items-center text-light200 mb-1 ">
                    <Icon.Lock />
                    <input
                      type="password"
                      className={`rounded-lg grow 
                         text-transparentDark border-1 border-light200 focus:outline-1 py-2 px-3 ${
                           passwordStatus === 2
                             ? "focus:caret-light200 focus:outline-light200"
                             : passwordStatus === 1
                             ? "focus:border-success focus:outline-success"
                             : "focus:outline-danger focus:caret-danger"
                         } `}
                      value={password}
                      onChange={(e) => {
                        checkPassword(e.target.value)
                        setPassword(e.target.value)
                      }}
                    />
                  </div>
                  <div
                    className={`text-sm flex gap-2 items-center h-5 leading-5 ${
                      passwordStatus !== 2 ? "visible" : "invisible"
                    } ${passwordStatus ? "text-success" : "text-danger "}`}
                  >
                    {passwordStatus === 0 ? (
                      <Icon.AlertTriangle size={16} />
                    ) : (
                      <Icon.CheckCircle size={16} />
                    )}
                    <p className="text-sm">
                      {passwordMessage}
                      <span className="invisible">123</span>
                    </p>
                  </div>
                </div>
                <button
                  className="button button-primary shadow-md shadow-primary mb-5"
                  onClick={(e) => onSubmit(e)}
                >
                  {isLoginPath ? "Log In" : "Sign up"}
                </button>
                <div className="text-center text-sm">
                  {`Don't have an account?  `}
                  <button
                    className="button-outline-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      isLoginPath ? navigate("/signup") : navigate("/signin")
                    }}
                  >
                    {isLoginPath ? "Sign up" : "Log In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <img className="background" src={backgroundImage} alt="image" />
      </div>
    </Fragment>
  )
}

export default Login
