import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from "react-router-dom";
import { DoctorContext } from '../context/DoctorContext';

const patientWebsiteUrl = 'https://docappointix-frontend.onrender.com';

const Navbar = () => {

    const { aToken , setAToken } = useContext(AdminContext)
    const {dToken, setDToken }=useContext(DoctorContext);

    const navigate = useNavigate();
    
    const logout = () => {
        navigate('/');
        aToken && setAToken('');
        aToken && localStorage.removeItem('aToken')
        dToken && setDToken('')
        dToken && localStorage.removeItem('dToken')
    }
    return (
        <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-3 px-4 sm:px-10 py-3 border-b border-b-gray-200 bg-white'>
            <div className='flex items-center gap-4 text-xs'>
                <a
                    href={patientWebsiteUrl}
                    className="flex items-center space-x-2 w-44"
                >
                    <img className="h-12 w-36" src={assets.admin_logo} alt="logo" />
                    <h1 className="text-xl font-bold">DocAppointix</h1>
                </a>
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500'>{aToken ? 'Admin' : 'Doctor'}</p>
            </div>
            <div className='ml-auto flex shrink-0 items-center justify-end gap-4'>
                <a
                    href={patientWebsiteUrl}
                    className='bg-gray-100 text-gray-600 border border-gray-300 px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider'
                >
                    Back to Patient Website
                </a>
                <button onClick={logout} className='bg-[#6C757D] text-white text-sm px-10 py-2 rounded cursor-pointer'>Logout</button>
            </div>
        </div>
    )
}

export default Navbar
