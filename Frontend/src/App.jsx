import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfiePage from './pages/ProfiePage'
import {Toaster} from 'react-hot-toast'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
const App = () => {
  const  {authUser}=useContext(AuthContext); 
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster/>
    <Routes>
      <Route path='/' element={authUser?<HomePage/>:<Navigate to='/login'/>}/>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />}/>
        <Route path='/profile' element={authUser ? <ProfiePage /> : <Navigate to='/login' />}/>
    </Routes>
    </div>
  )
}

export default App
