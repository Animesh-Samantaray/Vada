import React from 'react'
import logo from '../assets/logo.png'
import homeBG from '../assets/homeBG.jpg'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div
      className="h-screen flex pt-5 justify-between flex-col w-full bg-cover bg-center "
      style={{ backgroundImage: `url(${homeBG})` }}
    >
      <img src={logo} alt="SwiftGo Logo" className="w-24 h-8 ml-9" />

      <div className="bg-transparent py-5 px-10">
        <h2 className="text-2xl font-bold mb-3">
          Get Started with SwiftGo
        </h2>
        <Link to={'/login'} className="flex items-center justify-center bg-black text-white rounded w-full py-[5px] ">
          Continue
        </Link>
      </div>
    </div>
  )
}

export default Home
