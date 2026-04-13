import React, { useContext } from 'react'
import {useState} from 'react'
import { assets } from "../assets/assets.js"
import { NavLink,useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {
    const navigate=useNavigate();

    const {token,setToken, userData}=useContext(AppContext);

    const [showMenu,setShowMenu]=useState(false);

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token')
    }
    
    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            <div onClick={()=>{navigate('/')}} className="flex items-center space-x-2 w-44">
                <img src={assets.logo} alt="logo" className="h-12 w-12 cursor-pointer" />
                <h1 className="text-xl font-bold cursor-pointer">DocAppointix</h1>
            </div>
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'>
                    <li className="py-1">HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-[#CED4DA] w-3/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/doctors'>
                    <li className="py-1">ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-[#CED4DA] w-3/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/about'>
                    <li className="py-1">ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-[#CED4DA] w-3/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/contact'>
                    <li className="py-1">CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-[#CED4DA] w-3/5 m-auto hidden'/>
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {
                    token && userData
                    ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <img className="w-10 h-10 rounded-full" src={userData.image} alt="profile picture" />
                        <img className='w-2.5' src={assets.dropdown_icon} alt="dropdown icon" />
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 flex-col gap-4 p-4'>
                                <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={()=>navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div> 
                    : <button onClick={()=>navigate('/login')} className='bg-[#343A40] text-white px-8 rounded-xl h-9 fount-light hidden md:block cursor-pointer'>Create account</button>
                }
                <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="" />

                {/* Mobile Menu  */}
                <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <div className="flex items-center space-x-2 w-36">
                            <img className="h-10 w-30 cursor-pointer" src={assets.logo} alt="" />
                            <h1 className="text-lg font-bold cursor-pointer">DocAppointix</h1>
                        </div>
                        <img onClick={()=>setShowMenu(false)} src={assets.cross_icon} className='cursor-pointer w-7' alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={()=>setShowMenu(false)} to='/'><p className="px-4 py-2 rounded inline-block">HOME</p></NavLink>
                        <NavLink onClick={()=>setShowMenu(false)} to='/doctors'><p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p></NavLink>
                        <NavLink onClick={()=>setShowMenu(false)} to='/about'><p className="px-4 py-2 rounded inline-block">ABOUT</p></NavLink>
                        <NavLink onClick={()=>setShowMenu(false)} to='/contact'><p className="px-4 py-2 rounded inline-block">CONTACT</p></NavLink>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar
