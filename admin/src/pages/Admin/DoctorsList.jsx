import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect , useContext } from 'react';

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors } = useContext(AdminContext);

  useEffect(()=>{
    if(aToken){
      getAllDoctors();
    }
  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index)=>(
            <div key={index} className='border border-gray-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group shadow-lg'>
              <img className='bg-[#CED4DA] group-hover:bg-gray-400 transition-all duration-500' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='flex mt-2 items-center gap-1 text-sm'>
                  <input type="checkbox" checked={item.available} readOnly />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
