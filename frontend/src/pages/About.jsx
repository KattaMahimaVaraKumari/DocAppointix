import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='flex flex-cols flex-col md:flex-row gap-12 my-10'>
        <img className='w-full md:max-w-[260px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 mx-10'>
          <p>DocAppointix is a full-stack healthcare web application designed to simplify the process of booking doctor appointments and managing healthcare interactions. It provides a seamless and efficient platform for patients to connect with healthcare professionals.</p>
          <p>DocAppointix is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, DocAppointix is here to support you every step of the way.</p>
          <b className='text-gray-800'>Our vision</b>
          <p>Our vision is to create a seamless and accessible healthcare experience for everyone. We aim to bridge the gap between patients and healthcare providers, ensuring that quality care is always within reach.</p>
        </div>
      </div>
    </div>
  )
}

export default About
