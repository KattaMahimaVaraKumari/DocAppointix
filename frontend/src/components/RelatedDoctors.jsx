import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [relDoc, setRelDoc] = useState([])
  const renderStars = (ratingAverage = 0) => {
    const fullStars = Math.round(ratingAverage)
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= fullStars ? 'text-amber-400' : 'text-gray-300'}>&#9733;</span>
    ))
  }

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      // Recommend doctors from same speciality, excluding current profile.
      const doctorsData = doctors
        .filter((item) => item.speciality === speciality && item._id !== docId)
        .slice(0, 5)

      setRelDoc(doctorsData)
    } else {
      setRelDoc([])
    }
  }, [doctors, speciality, docId])

  if (relDoc.length === 0) return null

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-bold text-center'>Related Doctors</h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-500'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.map((item) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              scrollTo(0, 0)
            }}
            className='border border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white max-w-[250px]'
            key={item._id}
          >
            <img
              className='bg-[#CED4DA] w-full h-48 object-cover object-top'
              src={item.image}
              alt={item.name}
            />

            <div className='p-4 flex-1 flex flex-col'>
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>

              <p className='text-xs text-gray-500 mt-1'>
                {item.address?.city ? `${item.address.city}, ${item.address.state}` : 'New Doctor'}
              </p>

              <div className='flex items-center gap-1 mt-auto pt-2 text-sm'>
                {renderStars(item.ratingAverage)}
                <span className='text-gray-600 text-xs'>({item.ratingCount || 0})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }}
        className='bg-[#ADB5BD] text-white px-12 py-3 rounded-full mt-10 hover:bg-gray-400 transition-all cursor-pointer'
      >
        more
      </button>
    </div>
  )
}
export default RelatedDoctors