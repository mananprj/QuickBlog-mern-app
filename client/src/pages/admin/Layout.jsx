import React, { useCallback, useContext } from 'react'
import { assets } from '../../assets/assets'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar';
import { AppContext } from '../../context/AppContext';

const Layout = () => {

    const {axios, setToken, navigate} = useContext(AppContext);

    const logout = () => {
        localStorage.removeItem("token");
        axios.defaults.headers.common["Authorization"] = null;
        setToken(null);
        navigate("/");
    }

  return (
    <>
        <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-400'>
            <img src={assets.logo} className='w-32 sm:w-40 cursor-pointer' alt="" onClick={() => navigate("/")}/>
            <button className='text-md px-8 py-2 bg-primary text-white rounded-full cursor-pointer' onClick={logout}>Logout</button>
        </div>

        <div className='flex h-[calc(100vh-70px)]'>
            <Sidebar/>
            <Outlet/>
        </div>
    </>
  )
}

export default Layout