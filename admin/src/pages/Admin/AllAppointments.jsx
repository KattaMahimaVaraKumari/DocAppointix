import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {

  const {aToken, getAllAppointments, appointments, cancelAppointment}=useContext(AdminContext);
  const {calculateAge, slotDateFormat, currency}= useContext(AppContext);
  const navigate = useNavigate();

  useEffect (()=>{

    if(aToken){
      getAllAppointments();
    }

  },[aToken])

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border border-gray-300 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>

        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 border-b border-b-gray-300'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((item,index)=>(
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-b-gray-300 hover:bg-gray-50 cursor-pointer' key={index}>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" /> <p>{item.docData.name}</p>
            </div>
            <p>{currency} {item.amount}</p>
            <div className='flex flex-col sm:items-end gap-2'>
              <button
                onClick={() => navigate(`/appointment/${item._id}`)}
                className='text-blue-600 border border-blue-200 hover:bg-blue-50 rounded px-3 py-1 text-xs font-medium'
              >
                View Details
              </button>
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium'>Completed</p>
              ) : (
                <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
              )}
            </div>
          </div>
        ))}
         
      </div>

    </div>
  )
}

export default AllAppointments
