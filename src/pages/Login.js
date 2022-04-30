import React from "react"
import { Link, useLocation } from "react-router-dom"

const Login = () => {
  const { pathname } = useLocation()
  const isLoginPath = pathname.includes("sign-in")
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
      <form className="w-5/12">
        <div className="flex md:flex-row gap-3 md:gap-0 flex-col mb-3 w-full">
          <label htmlFor="email" className="md:w-32">
            Email
          </label>
          <input type="email" className="md:grow" id="email" />
        </div>
        <div className="flex md:flex-row flex-col gap-3 md:gap-0 w-full mb-7">
          <label htmlFor="password" className="md:w-32">
            Password
          </label>
          <input type="password" className="md:grow" id="password" autoComplete="false" />
        </div>
        <button className="button w-full">{isLoginPath ? "Login" : "Sign Up"}</button>
      </form>
    </div>
  )
}

export default Login
