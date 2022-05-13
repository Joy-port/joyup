import React, { useCallback, useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import * as Icon from "react-feather"
import { user } from "../sliceReducers/actions/user"
import { checkLoginMessage } from "../helpers/config"
import logo from "../assets/images/logo/primary/logo_transparent.png"
import backgroundImage from "../assets/illustrations/Life Management.png"
import { AuthContext } from "../components/AuthProvider"
import Loader from "../components/Loader"

const Login = () => {
  // const { id } = useSelector((state) => state.user)
  const [userDetail, loading, error] = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
    console.log("check login status", userDetail, loading, pathname)
    if (userDetail) {
      navigate("/calendar")
    }
    return
  }, [userDetail])
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
    if (!checkEmail(email) && !checkName(name) && !checkPassword(password)) return
    if (isLoginPath) {
      dispatch(user.nativeLogin(email, password))
    } else {
      dispatch(user.nativeSignUp(email, password, name))
    }
  }
  const checkEmail = useCallback((userEmail) => {
    // const reg =
    //   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const reg = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    if (!userEmail.trim()) {
      setEmailStatus(0)
      setEmailMessage(checkLoginMessage.email.required)
      return false
    } else if (!userEmail.toLowerCase().match(reg)) {
      setEmailStatus(0)
      setEmailMessage(checkLoginMessage.email.error)
      return false
    } else if (userEmail.toLowerCase().match(reg)) {
      setEmailStatus(1)
      setEmailMessage(checkLoginMessage.email.success)
      return true
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
    <>
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
                    <div className="flex gap-3 items-center text-light200 mb-1 ">
                      <Icon.User />
                      <input
                        type="text"
                        className={`rounded-lg grow text-transparentDark caret-light200 ${
                          nameStatus === 2
                            ? "caret-light200"
                            : nameStatus === 1
                            ? "caret-success"
                            : "caret-danger"
                        } `}
                        value={name}
                        onChange={(e) => {
                          checkName(e.target.value)
                          setName(e.target.value)
                        }}
                      />
                    </div>
                    <div
                      className={`text-sm flex gap-2 items-center ${
                        nameStatus !== 2 ? "visible" : "invisible"
                      } ${nameStatus ? "text-success" : "text-danger "}`}
                    >
                      {nameStatus === 0 ? (
                        <Icon.AlertTriangle size={16} />
                      ) : (
                        <Icon.CheckCircle size={16} />
                      )}
                      <p>{nameMessage || "123"}</p>
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
                      className={`rounded-lg grow text-transparentDark ${
                        emailStatus === 2
                          ? "caret-light200"
                          : emailStatus === 1
                          ? "caret-success"
                          : "caret-danger"
                      } `}
                      value={email}
                      onChange={(e) => {
                        checkEmail(e.target.value)
                        setEmail(e.target.value)
                      }}
                    />
                  </div>
                  <div
                    className={`text-sm flex gap-2 items-center transition-all ${
                      emailStatus !== 2 ? "visible" : "invisible"
                    } ${emailStatus ? "text-success" : "text-danger "}`}
                  >
                    {emailStatus === 0 ? (
                      <Icon.AlertTriangle size={16} />
                    ) : (
                      <Icon.CheckCircle size={16} />
                    )}
                    <p>{emailMessage || "123"}</p>
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
                      className={`rounded-lg grow text-transparentDark ${
                        passwordStatus === 0
                          ? "caret-danger"
                          : passwordStatus === 1
                          ? "caret-success"
                          : "caret-light200"
                      } `}
                      value={password}
                      onChange={(e) => {
                        checkPassword(e.target.value)
                        setPassword(e.target.value)
                      }}
                    />
                  </div>
                  <div
                    className={`text-sm flex gap-2 items-center transition-all ${
                      passwordStatus !== 2 ? "visible" : "invisible"
                    } ${passwordStatus ? "text-success" : "text-danger "}`}
                  >
                    {passwordStatus === 0 ? (
                      <Icon.AlertTriangle size={16} />
                    ) : (
                      <Icon.CheckCircle size={16} />
                    )}
                    <p>{passwordMessage || "123"}</p>
                  </div>
                </div>
                <button className="button button-primary shadow-md shadow-primary mb-5">
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
    </>
  )
}

export default Login
