import React, { useEffect } from 'react'
import {FaFileAlt} from "react-icons/fa"
import {TbLogout} from "react-icons/tb"
import { useDispatch, useSelector } from 'react-redux'
import { setIsLogedIn, setUserEmail } from '../redux/slices/formSlice'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const {userEmail} = useSelector((state)=> state.form)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    dispatch(setIsLogedIn(false));
    navigate("/signin");
  }
  useEffect(()=>{
    if(localStorage.getItem("userData")){
      let userData = JSON.parse(localStorage.getItem("userData"));
      dispatch(setUserEmail(userData.email))
    }
    
  },[])
  return (
    <nav className='w-full h-[80px] flex justify-between items-center px-[100px] shadow-md'>
            <div className='flex items-center gap-4'>
                <FaFileAlt className='text-4xl text-blue-800'/>
                <p className='text-3xl'>Forms</p>
            </div>
            <div className='flex items-center gap-8'>
                <p className='px-3 py-2 rounded-full bg-blue-800 text-white'>{(userEmail !== "" ? userEmail.slice(0,2).toUpperCase() : "")}</p>
                <TbLogout className='text-xl cursor-pointer' onClick={handleLogout}/>
            </div>
    </nav>
  )
}

export default Navbar