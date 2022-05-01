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
      navigate("/home")
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
    <div className="flex flex-col justify-center items-center h-screen">
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
      <form className="w-5/12" onSubmit={onSubmit}>
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
  )
}

Login.propTypes = {
  pathname: string,
}

export default Login
