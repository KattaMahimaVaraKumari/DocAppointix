import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      // Recommend doctors from same speciality, excluding current profile.
      const doctorsData = doctors
        .filter((item) => item.speciality === speciality && item._id !== docId)
        .slice(0, 5)

      setRelDoc(doctorsData);
    }
  }, [doctors, speciality, docId])

  if (relDoc.length === 0) return null

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-bold text-center'>Similar Specialists</h1>
      <p className='sm:w-1/2 text-center text-sm text-gray-500'>
        Based on your selection, here are other highly-rated doctors in the same field you might want to consult.
      </p>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5 px-3 sm:px-0 justify-items-center'>
        {relDoc.map((item) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              window.scrollTo(0, 0)
            }}
            className='border border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white max-w-[250px]'
            key={item._id} >

            <img className='bg-[#ADB5BD] w-full' src={item.image} alt={item.name} />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>
            
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => { navigate('/doctors'); window.scrollTo(0,0) }} 
        className='bg-[#ADB5BD] text-white px-12 py-3 rounded-full mt-10 hover:bg-gray-400 transition-all cursor-pointer'
      >
        more
      </button>
      
    </div>
  )
}

export default RelatedDoctors