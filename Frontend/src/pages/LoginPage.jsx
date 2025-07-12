import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const[currState,setCurrState]=useState("Sign Up")
  const [fullName,setFullName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [bio,setBio]=useState("")
  const [isDataSubmited,setIsDataSubmited]=useState(false)

  const {login}=useContext(AuthContext)

  const onSubmitHandler=(e)=>{
    e.preventDefault()
    if(currState==="Sign Up" && !isDataSubmited){
      setIsDataSubmited(true)
      return;
  }
    login(currState === 'Sign Up' ? 'register' : 'login',{fullName,email,password,bio})
}
  return (
    <div className='min-h-screen bg-hover bg-center flex items-center justify -center gap-8  sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]'
       />

       {/* right */}
       <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center text-white'>{currState}{isDataSubmited && <img onClick={()=>setIsDataSubmited(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
        
       </h2>
       {currState==="Sign Up" &&  !isDataSubmited &&(
          <input 
            onChange={(e) => setFullName(e.target.value)} value={fullName}type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full name' required />
       )}
       {!isDataSubmited && (
        <>
        <input onChange={(e)=>setEmail(e.target.value)} value={email}
         type="email" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Email Address' required />
          <input onChange={(e) => setPassword(e.target.value)} value={password}
         type="password" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Password' required />
        {/* <input type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Bio' required /> */}
        {/* <button className='bg-[#8185B2] text-white p-2 rounded-md' type='submit'>Sign Up</button>  */}
        </>
       )}
       {
        currState==="Sign Up" && isDataSubmited && (
            <textarea onChange = { (e) => setBio(e.target.value)} value={bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Bio' required></textarea>
        )
       }

        <button  type='submit' className='bg-[#8185B2] text-white p-2 rounded-md'>
        {currState==="Sign Up" ? "Create Account" : "Login"}
       </button>
       <div className='flex items-center gap-2 text-sm text-gray-500'>
        <input type="checkbox" name="" id="" />
        <p>Agree to the terms of use & privacy policy.</p>
       </div>
       
       <div className='flex flex-col gap-2'>
        {
          currState==="Sign Up"?(
              <p className='text-sm text-gray-600'>Already have an account? <span className='font-medium text-violet-500 cursor-pointer' onClick={() =>{ setCurrState("Login");setIsDataSubmited(false)}}>Login Here</span></p>
          ):(
                <p className='text-sm text-gray-600'>
                  Don't have an account? <span className='font-medium text-violet-500 cursor-pointer' onClick={() => {setCurrState("Sign Up"); setIsDataSubmited(true)  }}>Sign Up Here</span> 
            </p>
          )
        }
       </div>

       </form>
    </div>
  )
}

export default LoginPage
