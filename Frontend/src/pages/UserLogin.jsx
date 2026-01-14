import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    console.log({ email, password })
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center
                    bg-gradient-to-br from-indigo-50 via-sky-50 to-indigo-100 px-4">

      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img src={logo} alt="SwiftGo" className="w-28" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="text-gray-500 mt-1">
            Sign in to book your next ride
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="input"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input"
            />
          </div>

          <button className="primary-btn bg-indigo-600 hover:bg-indigo-700">
            Continue
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          New to SwiftGo?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* Switch Role Button */}
      <Link
        to="/captain-login"
        className="mt-6 w-full max-w-md"
      >
        <button className="secondary-btn">
          Sign in as Captain
        </button>
      </Link>

      {/* Utilities */}
      <style>{`
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: #f3f4f6;
          outline: none;
          transition: all 0.2s;
        }
        .input:focus {
          background: white;
          box-shadow: 0 0 0 2px #6366f1;
        }
        .primary-btn {
          width: 100%;
          color: white;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1.05rem;
          transition: all 0.2s;
        }
        .secondary-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 600;
          background: white;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }
        .secondary-btn:hover {
          background: #f9fafb;
        }
      `}</style>
    </div>
  )
}

export default UserLogin
