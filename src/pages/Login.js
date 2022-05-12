import { string } from "prop-types"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { user } from "../sliceReducers/actions/user"
import logo from "../assets/images/logo/primary/logo_transparent.png"
import backgroundImage from "../assets/illustrations/Life Management.png"
import * as Icon from "react-feather"

//{ pathname }
const Login = () => {
  // const { id } = useSelector((state) => state.user)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [status, setStatus] = useState(2)
  const [errorType, setErrorType] = useState(2)
  // const isLoginPath = pathname === "sign-in"

  // useEffect(() => {
  //   if (id !== "") {
  //     navigate("/")
  //   }
  // }, [id])

  const onSubmit = (e) => {
    e.preventDefault()
    if (isLoginPath) {
      dispatch(user.nativeLogin(email, password))
    } else {
      dispatch(user.nativeSignUp(email, password, name))
    }
  }
  return (
    <div
      className="h-screen"
      // style={{
      //   background: "linear-gradient(#e66465BF, #9198e5BF)",
      // }}
    >
      <div className="p-5">
        <div className="flex items-center">
          <img src={logo} alt="JoyUp logo" className="max-w-full block h-14" />
          <p className="font-sans font-bold text-2xl">JoyUp</p>
        </div>
        <code className="ml-4 text-sm">
          brighten your life with a better life management
        </code>
      </div>
      <div className="flex flex-col justify-center items-center my-0 -mt-32 h-full px-5">
        <div className="px-14 md:px-24 py-12 w-full md:w-128 bg-white rounded-lg shadow-lg shadow-blue100 flex flex-col gap-6">
          <h1 className="heading-two text-center"> Welcome back! </h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="name" className="text-sm">
                Full Name
              </label>
              <div className="flex gap-3 items-center py-1 text-light200 ">
                <Icon.User />
                <input
                  type="text"
                  className={`rounded-lg grow ${
                    errorType === 0
                      ? "caret-danger"
                      : errorType === 1
                      ? "caret-success"
                      : "caret-light300"
                  } `}
                />
              </div>
              <div
                className={`text-sm flex gap-2 items-center ${
                  status ? "invisible" : "visible"
                } ${errorType ? "text-danger" : "text-success"}`}
              >
                {errorType ? (
                  <Icon.AlertTriangle size={16} />
                ) : (
                  <Icon.CheckCircle size={16} />
                )}
                <small>error message</small>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <div className=" flex gap-3 items-center py-1 text-light200 ">
                <Icon.Mail />
                <input
                  type="email"
                  className={`rounded-lg grow ${
                    errorType === 0
                      ? "caret-danger"
                      : errorType === 1
                      ? "caret-success"
                      : "caret-light300"
                  } `}
                />
              </div>
              <div
                className={`text-sm flex gap-2 items-center ${
                  status ? "invisible" : "visible"
                } ${errorType ? "text-danger" : "text-success"}`}
              >
                {errorType ? (
                  <Icon.AlertTriangle size={16} />
                ) : (
                  <Icon.CheckCircle size={16} />
                )}
                <small>error message</small>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <div className=" flex gap-3 items-center py-1 text-light200 ">
                <Icon.Lock />
                <input
                  type="password"
                  className={`rounded-lg grow ${
                    errorType === 0
                      ? "caret-danger"
                      : errorType === 1
                      ? "caret-success"
                      : "caret-light300"
                  } `}
                />
              </div>
              <div
                className={`text-sm flex gap-2 items-center ${
                  status ? "invisible" : "visible"
                } ${errorType ? "text-danger" : "text-success"}`}
              >
                {errorType ? (
                  <Icon.AlertTriangle size={16} />
                ) : (
                  <Icon.CheckCircle size={16} />
                )}
                <small>error message</small>
              </div>
              <button className="button button-primary shadow-md shadow-primary mb-5">
                Log In
              </button>

              <div className="text-center text-sm">
                {`Don't have an account?  `}
                <button className="button-outline-primary">Sign up</button>
              </div>
            </div>
          </form>
        </div>
        {/* <form className="w-full md:w-5/12 bg-white p-3 rounded-xl" onSubmit={onSubmit}>
          <div className="flex mb-10">
            <Link
              className={`
          px-4
          py-2
          border-b-2 
        hover:border-slateLight active:border-slateLight ${
          isLoginPath ? "border-slateLight" : "border-light200"
        }`}
              to="/signin"
            >
              Sign in
            </Link>
            <Link
              className={`px-4
          py-2
          border-b-2 
        hover:border-slateLight active:border-slateLight ${
          !isLoginPath ? "border-slateLight" : "border-light200"
        }`}
              to="/signup"
            >
              Sign up
            </Link>
          </div>
          <div className="flex md:flex-row gap-3 md:gap-0 flex-col mb-3 w-full">
            <label htmlFor="name" className="md:w-32">
              Name
            </label>
            <input
              type="name"
              className="md:grow"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex md:flex-row gap-3 md:gap-0 flex-col mb-3 w-full">
            <label htmlFor="email" className="md:w-32">
              Email
            </label>
            <input
              type="email"
              className="md:grow"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex md:flex-row flex-col gap-3 md:gap-0 w-full mb-7">
            <label htmlFor="password" className="md:w-32">
              Password
            </label>
            <input
              type="password"
              className="md:grow"
              id="password"
              autoComplete="false"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="button w-full" onClick={onSubmit}>
            {isLoginPath ? "Login" : "Sign Up"}
          </button>
        </form> */}
      </div>
      <img
        className="background"
        src={backgroundImage}
        alt="image"
        // style={{ backgroundImage: `url(${backgroundImage})` }}
      />
    </div>
  )
}

// Login.propTypes = {
//   pathname: string.isRequired,
// }

export default Login
