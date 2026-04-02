import React from 'react'
import { assets } from "../assets/assets.js"
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            <div className="flex items-center space-x-2 w-44">
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
                <button className='bg-[#343A40] text-white px-8 rounded-xl h-9 fount-light hidden md:block cursor-pointer'>Create account</button>
            </div>
        </div>
    )
}

export default Navbar
