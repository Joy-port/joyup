import { string } from "prop-types"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { user } from "../sliceReducers/actions/user"

const Login = ({ pathname }) => {
  const { id } = useSelector((state) => state.user)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoginPath = pathname === "sign-in"

  useEffect(() => {
    if (id !== "") {
      navigate("/")
    }
  }, [id])

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
      style={{
        background: "linear-gradient(#e66465BF, #9198e5BF)",
      }}
    >
      <h1 className="font-sans font-bold text-4xl text-white p-5">
        <p>JoyUP</p>
        <code className="text-xs text-white">
          bright your life with a better life management
        </code>
      </h1>
      <div className="flex flex-col justify-center items-center my-0 -mt-32 h-full px-3">
        <form className="w-full md:w-5/12 bg-white p-3 rounded-xl" onSubmit={onSubmit}>
          <div className="flex mb-10">
            <Link
              className={`
          px-4
          py-2
          border-b-2 
        hover:border-slateLight active:border-slateLight ${
          isLoginPath ? "border-slateLight" : "border-light200"
        }`}
              to="/login/sign-in"
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
              to="/login/sign-up"
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
        </form>
      </div>
    </div>
  )
}

Login.propTypes = {
  pathname: string,
}

export default Login
