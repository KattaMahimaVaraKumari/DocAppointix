import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
             {/* Left Section  */}
             <div>
                <div className='flex items-center space-x-2 w-44'>
                    <img className="h-12 w-12 mb-5" src={assets.logo} alt="" />
                    <h1 className='mb-5 text-xl font-bold'>DocAppointix</h1>
                </div>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
             </div>

             {/* Middle Section  */}
             <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
             </div>

             {/* Right Section  */}
             <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1-234-456-7890</li>
                    <li>abcdef123@gmail.com</li>
                </ul>
             </div>
        </div>

        {/* copy right  */}
        <div>
            <hr className='text-gray-500'/>
            <p className='py-5 text-sm text-center'>Copyright © 2026 ABC - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
