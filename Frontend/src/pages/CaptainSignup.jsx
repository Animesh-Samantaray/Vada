import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import CaptainContext, { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    color: "",
    plate: "",
    capacity: "",
    vehicleType: "car",
  });
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname: formData.firstname,
        lastname: formData.lastname,
      },
      email: formData.email,
      password: formData.password,
      vehicle: {
        color: formData.color,
        plate: formData.plate,
        capacity: Number(formData.capacity),
        vehicleType: formData.vehicleType,
      },
    };
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/captains/register`,
      captainData,
      { withCredentials: true }
    );

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }
    console.log(captainData);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center
                    bg-gradient-to-br from-neutral-100 via-gray-100 to-neutral-200 px-4"
    >
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img src={logo} alt="SwiftGo" className="w-28" />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-xl bg-white/90 backdrop-blur
                      rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Captain Registration
          </h2>
          <p className="text-gray-500 mt-1">
            Become a SwiftGo driver and start earning
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstname"
              placeholder="First name"
              required
              value={formData.firstname}
              onChange={handleChange}
              className="input"
            />
            <input
              name="lastname"
              placeholder="Last name"
              value={formData.lastname}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleChange}
            className="input"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Create password"
            required
            value={formData.password}
            onChange={handleChange}
            className="input"
          />

          {/* Vehicle Info */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Vehicle Details
            </p>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="color"
                placeholder="Vehicle color"
                required
                value={formData.color}
                onChange={handleChange}
                className="input"
              />
              <input
                name="plate"
                placeholder="Plate number"
                required
                value={formData.plate}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                type="number"
                name="capacity"
                placeholder="Seating capacity"
                required
                value={formData.capacity}
                onChange={handleChange}
                className="input"
              />

              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="input"
              >
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>

          {/* CTA */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl
                       font-semibold text-lg
                       hover:bg-gray-900 active:scale-[0.98]
                       transition-all"
          >
            Register as Captain
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already registered?{" "}
          <Link
            to="/captain-login"
            className="font-semibold text-black hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Tailwind Input Utility */}
      <style>
        {`
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
            box-shadow: 0 0 0 2px black;
          }
        `}
      </style>
    </div>
  );
};

export default CaptainSignup;
