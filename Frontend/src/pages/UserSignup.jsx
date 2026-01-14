import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const UserSignup = () => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()

    const userData = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    }

    console.log(userData)

    setFirstname('')
    setLastname('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center 
                    bg-gradient-to-br from-neutral-100 via-gray-100 to-neutral-200 px-4">

      {/* Logo – Top Left */}
      <div className="absolute top-6 left-6">
        <img src={logo} alt="SwiftGo Logo" className="w-28 h-auto" />
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur 
                      rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Create your account
          </h2>
          <p className="text-gray-500 mt-1">
            Join SwiftGo and ride smarter 🚀
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={submitHandler}>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                type="text"
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Animesh"
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-base 
                           outline-none focus:ring-2 focus:ring-black 
                           focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Kumar"
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-base 
                           outline-none focus:ring-2 focus:ring-black 
                           focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-base 
                         outline-none focus:ring-2 focus:ring-black 
                         focus:bg-white transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-base 
                         outline-none focus:ring-2 focus:ring-black 
                         focus:bg-white transition-all"
            />
          </div>

          {/* CTA */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl 
                       font-semibold text-lg 
                       hover:bg-gray-900 active:scale-[0.98] 
                       transition-all"
          >
            Create Account
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-black hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default UserSignup
