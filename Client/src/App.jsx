import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import Settings from './Pages/Settings'
import Profile from './Pages/Profile'
import { useAuthStore } from './Store/useAuthStore'
import {CodeSquare, Loader } from "lucide-react" ;
import { Toaster } from 'react-hot-toast'
import {useThemeStore} from "./Store/useThemeStore"

function App() {
    const {authUser , checkAuth , isCheckingAuth } = useAuthStore() ; 
    const {theme} = useThemeStore();

    useEffect(() => {
      checkAuth();
    },[checkAuth])
    
    if(isCheckingAuth && !authUser ) return(
       <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
       </div>
    )


  return (
   <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to="/" /> } />
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to="/" />} />
        <Route path='/settings' element={<Settings/>} />
        <Route path='/profile' element={authUser ? <Profile/> : <Navigate to ="/login" />} />
      </Routes>

      <Toaster/>
   </div>
  )
}

export default App
