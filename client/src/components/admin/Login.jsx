import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {axios, setToken} = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handelsubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post("/api/admin/login", {email, password});
            if(data.success){
                setToken(data.token);
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["Authorization"] = data.token;
                toast.success("Login Succeessfully")
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='w-ful max-w-sm p-10 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
            <div className='flex flex-col items-center justify-center '>
                <div className='w-full py-5 text-center '>
                    <h1 className='text-3xl font-bold mb-3'><span className='text-primary'>Admin</span> Login</h1>
                    <p className='font-light'>Enter your credentials to access the admin panel</p>
                </div>
                <form onSubmit={handelsubmit} className='w-full sm:max-w-md text-gray-700'>
                    <div className='flex flex-col'>
                        <label> Email</label>
                        <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} required placeholder='your email id' className='border-b-2 border-gray-300 p-2 outline-none mb-6'/>
                    </div>
                    <div className='flex flex-col'>
                        <label>Password</label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} required placeholder='your password' className='border-b-2 border-gray-300 p-2 outline-none mb-6'/>
                    </div>
                    <button type='submit' className='w-full py-2 font-medium text-lg bg-primary text-white rounded cursor-pointer hover:bg-primary/80 transition-all'>Login</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login