import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';
function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            try {
              localStorage.removeItem('userData')
            } catch (storageError) {
              console.warn("Failed to clear localStorage:", storageError)
            }
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")

        } catch (error) {
            console.error("Logout Error:", error.response?.status, error.response?.data?.message || error.message)
        }
    }
    return (
        <div className="w-full fixed top-0 left-0 z-50 bg-[rgba(10,14,26,0.8)] backdrop-blur-[20px] border-b border-(--border) flex justify-center px-4 py-3">
                <motion.div 
                initial={{opacity:0 , y:-40}}
                animate={{opacity:1 , y:0}}
                transition={{duration: 0.3}}
                className='w-full max-w-6xl flex justify-between items-center relative'>
            <div className='flex items-center gap-3 cursor-pointer'>
                                <h1 className='font-bold text-2xl text-(--text-primary) flex items-center'>
                                    InterviewIQ
                                    <span className='text-(--accent-green)'>.</span>
                                </h1>
            </div>

            <div className='flex items-center gap-6  relative'>
                <div className='relative'>
                    <button onClick={()=>{
                        if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false)
                    }} className='flex items-center gap-2 px-4 py-2 rounded-full text-md transition relative'>
                        <span className='p-1 rounded-full bg-(--accent-green-glow)'>
                          <BsCoin size={20} className='text-(--accent-green)' />
                        </span>
                        <span className='text-(--accent-green) font-semibold'>{userData?.credits || 0}</span>
                    </button>

                    {showCreditPopup && (
                        <div className='absolute -right-12.5 mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50'>
                            <p className='text-sm text-gray-600 mb-4'>Need more credits to continue interviews?</p>
                            <button onClick={()=>navigate("/pricing")} className='w-full bg-black text-white py-2 rounded-lg text-sm'>Buy more credits</button>

                        </div>
                    )}
                </div>

                <div className='relative'>
                    <button
                      onClick={() => {
                        if (!userData) {
                          setShowAuth(true);
                          return;
                        }
                        setShowUserPopup(!showUserPopup);
                        setShowCreditPopup(false);
                      }}
                      className='w-9 h-9 rounded-full flex items-center justify-center font-semibold p-0.5 bg-linear-to-tr from-(--accent-green) to-(--accent-green-dim)'>
                        <div className='w-full h-full bg-(--bg-card) rounded-full flex items-center justify-center text-(--text-primary)'>
                          {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={16}/>} 
                        </div>
                    </button>

                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-48 bg-(--bg-card) shadow-xl border border-(--border) rounded-xl p-4 z-50'>
                            <p className='text-md text-(--accent-green) font-medium mb-1'>{userData?.name}</p>

                            <button onClick={()=>navigate("/history")} className='w-full text-left text-sm py-2 text-(--text-secondary) hover:text-(--text-primary)'>InterView History</button>
                            <button onClick={handleLogout} 
                            className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-500'>
                                <HiOutlineLogout size={16}/>
                                Logout</button>
                        </div>
                    )}
                </div>

            </div>



        </motion.div>

        {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
      
    </div>
  )
}

export default Navbar
