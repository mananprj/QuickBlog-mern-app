import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {

    const {navigate, token} = useContext(AppContext)

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-20 cursor-pointer'>
        <img onClick={() => navigate("/")} src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer'/>
        <button onClick={() => navigate("/admin")} className='flex items-center gap-2 rounded-full text-md cursor-pointer bg-primary text-white px-10 py-2.5'>
          {token ? "Dashboard" : "Login"}  
          <img src={assets.arrow} alt="arrow" className='w-3' /></button>
    </div>
  )
}

export default Navbar