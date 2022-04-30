import React from "react"
import { Link, useLocation } from "react-router-dom"

const Login = () => {
  const { pathname } = useLocation()
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex">
        <Link
          className="border-b-2 
        border-light200
        hover:border-slateLight active:border-slateLight"
          to="/login/sign-in"
        >
          Sign in
        </Link>
        <Link
          className="border-b-2 
        border-light200
        hover:border-slateLight active:border-slateLight"
          to="/login/sign-up"
        >
          Sign up
        </Link>
      </div>
      <form className="">
        <div className="flex md:flex-row flex-col">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
        </div>
        <div className="flex md:flex-row flex-col">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" autoComplete="false" />
        </div>
        <button>{pathname.includes("sign-up") ? "Sign Up" : "Login"}</button>
      </form>
    </div>
  )
}

export default Login
