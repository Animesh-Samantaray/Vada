import React, { useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
const CaptainProtectWrapper = ({ children }) => {
    const [isLoading,setIsLoading] = useState(true);

  const { captain,setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token ) {
      navigate("/captain-login");
    }
  }, [token]);

  axios.get(`${import.meta.env.VITE_API_URL}/captains/profile`,{
    headers:{
        Authorization: `Bearer ${token}`
    }
  }).then(response=>{
    if(response.status==200){
        setCaptain(response.data.captain);
        setIsLoading(false);
    }
  }).catch((err)=>{
    console.log(err);
    localStorage.removeItem('token');
    navigate('/captain-login')
  })
  if(isLoading){
    return <>
    Loading . . . . . .
    </>
  }
  return <>{children}</>;
};

export default CaptainProtectWrapper;
