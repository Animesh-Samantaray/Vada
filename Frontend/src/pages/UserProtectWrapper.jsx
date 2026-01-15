import React, { useEffect } from "react";
import { UserDataContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const UserProtectWrapper = ({ children }) => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);
  return <>{children}</>;
};

export default UserProtectWrapper;
