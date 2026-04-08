import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'

const Navbar = () => {

    const { aToken } = useContext(AdminContext)

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            <div className='flex items-center gap-4 text-xs'>
                <div className="flex items-center space-x-2 w-44">
                    <img className="h-12 w-36 cursor-pointer"  src={assets.admin_logo} alt="" />
                     <h1 className="text-xl font-bold cursor-pointer">DocAppointix</h1>         
                </div>
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500'>{aToken ? 'Admin' : 'Doctor'}</p>
            </div>
            <button className='bg-[#6C757D] text-white text-sm px-10 py-2 rounded cursor-pointer'>Logout</button>
        </div>
    )
}

export default Navbar
