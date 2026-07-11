import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/auth'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
import PaymentSuccess from './pages/PaymentSuccess'

// make sure this matches the PORT used by the Express server (see server/.env)
// the server `.env` in this repo currently sets PORT=8000, so that is the
// value we should hit by default. you can override via a client env var as
// shown below.
// (Vite exposes variables prefixed with VITE_.)
// create a `client/.env` containing:
//
// VITE_SERVER_URL="http://localhost:8000"
//
// the fallback is also set to 8000 so you don't have to create the file.
export const ServerUrl =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function App() {

  const dispatch = useDispatch()
  const [serverUp, setServerUp] = useState(true);

  useEffect(()=>{
    // ping backend to check availability every few seconds
    const checkServer = async () => {
      try {
        await axios.get(ServerUrl + "/ping", {timeout:2000});
        setServerUp(true);
      } catch (err) {
        console.warn("Server ping failed", err.message);
        setServerUp(false);
      }
    };

    const intervalId = setInterval(checkServer, 3000);

    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {withCredentials:true})
        dispatch(setUserData(result.data))
        // Persist user data to localStorage
        try {
          localStorage.setItem('userData', JSON.stringify(result.data))
        } catch (storageError) {
          console.warn("Failed to save to localStorage:", storageError)
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error.response?.status, error.response?.data?.message || error.message)

        // Try to restore from localStorage if server fetch failed
        try {
          const savedUserData = localStorage.getItem('userData')
          if (savedUserData) {
            const userData = JSON.parse(savedUserData)
            dispatch(setUserData(userData))
            console.log("Restored user from localStorage")
          } else {
            dispatch(setUserData(null))
          }
        } catch (e) {
          console.error("Failed to restore from localStorage:", e)
          dispatch(setUserData(null))
          try {
            localStorage.removeItem('userData')
          } catch (clearError) {
            console.warn("Failed to clear localStorage:", clearError)
          }
        }
      }
    }

    // Check localStorage first before making API call
    try {
      const savedUserData = localStorage.getItem('userData')
      if (savedUserData) {
        const userData = JSON.parse(savedUserData)
        dispatch(setUserData(userData))
        console.log("Loaded user from localStorage")
      }
    } catch (e) {
      console.error("Failed to load from localStorage on startup:", e)
      try {
        localStorage.removeItem('userData')
      } catch (clearError) {
        console.warn("Failed to clear localStorage on startup:", clearError)
      }
    }

    checkServer();
    getUser();

    return () => clearInterval(intervalId);
  },[dispatch])
  return (
    <>
      {!serverUp && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50">
          Unable to connect to backend server.
          <br />Make sure the backend is running (for example, cd server && npm run dev).
        </div>
      )}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/interview' element={<InterviewPage/>}/>
        <Route path='/history' element={<InterviewHistory/>}/>
        <Route path='/pricing' element={<Pricing/>}/>
        <Route path='/payment-success' element={<PaymentSuccess/>}/>
        <Route path='/report/:id' element={<InterviewReport/>}/>
      </Routes>
    </>
  )
}

export default App
