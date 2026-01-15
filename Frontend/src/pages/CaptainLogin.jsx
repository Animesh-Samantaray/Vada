import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useState({});
  const {captain,setCaptain}=useContext(CaptainDataContext);
  const navigate=useNavigate();
  const submitHandler = async(e) => {
    e.preventDefault();
    setCaptainData({ email, password });
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/captains/login`,captainData,{withCredentials:true});
    if(response.status==200){
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token',data.token)
      navigate('/captain-home');
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center 
                    bg-gradient-to-br from-neutral-100 via-gray-100 to-neutral-200 px-4"
    >
      {/* Logo – Top Left */}
      <div className="absolute top-6 left-6">
        <img src={logo} alt="SwiftGo Logo" className="w-28 h-auto" />
      </div>

      {/* Login Card */}
      <div
        className="w-full max-w-md bg-white/90 backdrop-blur 
                      rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚗</span>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Captain Login
            </h2>
          </div>
          <p className="text-gray-500">
            Drive smart. Earn more. Grow with SwiftGo.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="captain@swiftgo.com"
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-base 
                         outline-none focus:ring-2 focus:ring-black 
                         focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-base 
                         outline-none focus:ring-2 focus:ring-black 
                         focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl 
                       font-semibold text-lg 
                       hover:bg-gray-900 active:scale-[0.98] 
                       transition-all"
          >
            Go Online
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-400 uppercase">
            switch role
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Footer */}
        <div className="space-y-3 text-center text-sm">
          <p className="text-gray-500">
            New Captain?{" "}
            <Link
              to="/captain-signup"
              className="font-semibold text-black hover:underline"
            >
              Register here
            </Link>
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1 
                       text-gray-500 hover:text-black transition"
          >
            Sign in as User →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;
