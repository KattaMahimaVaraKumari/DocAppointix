import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

/** Stable key for case-insensitive matching (India vs india → same bucket) */
const norm = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '')

/**
 * From a list of doctors, collect unique location parts.
 * First seen spelling becomes the display label; key is always lowercased.
 */
const uniqueLocationParts = (doctorList, accessor) => {
  const map = new Map()
  for (const doc of doctorList) {
    const raw = accessor(doc)
    if (raw == null) continue
    const str = String(raw).trim()
    if (!str) continue
    const key = str.toLowerCase()
    if (!map.has(key)) map.set(key, str)
  }
  return Array.from(map.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))
}

const Doctors = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [countryOptions, setCountryOptions] = useState([])
  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const navigate = useNavigate()

  // --- Parent change → reset children (cascading reset)
  useEffect(() => {
    setSelectedState('')
    setSelectedCity('')
  }, [selectedCountry])

  useEffect(() => {
    setSelectedCity('')
  }, [selectedState])

  // --- Unique countries from entire doctors list (safe optional chaining)
  useEffect(() => {
    const options = uniqueLocationParts(doctors, (doc) => doc?.address?.country)
    setCountryOptions(options)
  }, [doctors])

  // --- States: only for selected country (normalized match)
  useEffect(() => {
    if (!selectedCountry) {
      setStateOptions([])
      return
    }
    const inCountry = doctors.filter((doc) => norm(doc?.address?.country) === selectedCountry)
    const options = uniqueLocationParts(inCountry, (doc) => doc?.address?.state)
    setStateOptions(options)
  }, [doctors, selectedCountry])

  // --- Cities: only for selected country + state
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCityOptions([])
      return
    }
    const narrowed = doctors.filter(
      (doc) =>
        norm(doc?.address?.country) === selectedCountry &&
        norm(doc?.address?.state) === selectedState
    )
    const options = uniqueLocationParts(narrowed, (doc) => doc?.address?.city)
    setCityOptions(options)
  }, [doctors, selectedCountry, selectedState])

  const applyFilter = () => {
    let doctorsData = [...doctors]

    if (speciality) {
      doctorsData = doctorsData.filter((doc) => doc.speciality === speciality)
    }
    if (selectedCountry) {
      doctorsData = doctorsData.filter((doc) => norm(doc?.address?.country) === selectedCountry)
    }
    if (selectedState) {
      doctorsData = doctorsData.filter((doc) => norm(doc?.address?.state) === selectedState)
    }
    if (selectedCity) {
      doctorsData = doctorsData.filter((doc) => norm(doc?.address?.city) === selectedCity)
    }

    setFilterDoc(doctorsData)
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, selectedCountry, selectedState, selectedCity])

  const renderStars = (ratingAverage = 0) => {
    const fullStars = Math.round(ratingAverage)
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= fullStars ? 'text-amber-400' : 'text-gray-300'}>&#9733;</span>
    ))
  }

  const resetLocationFilters = () => {
    setSelectedCountry('')
    setSelectedState('')
    setSelectedCity('')
  }

  const countrySelectEmpty = countryOptions.length === 0

  return (
    <div>
      <p className='text-gray-600'>Browse through the specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600 w-full sm:w-auto'>
          <p onClick={() => (speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician'))} className={`w[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-gray-100 text-black' : ''}`}>General physician</p>
          <p onClick={() => (speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist'))} className={`w[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-gray-100 text-black' : ''}`}>Gynecologist</p>
          <p onClick={() => (speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist'))} className={`w[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-gray-100 text-black' : ''}`}>Dermatologist</p>
          <p onClick={() => (speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians'))} className={`w[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-gray-100 text-black' : ''}`}>Pediatricians</p>
          <p onClick={() => (speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist'))} className={`w[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-gray-100 text-black' : ''}`}>Neurologist</p>
          <p onClick={() => (speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist'))} className={`w[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-gray-100 text-black' : ''}`}>Gastroenterologist</p>

          <div className='bg-white border border-blue-100 rounded-2xl shadow-sm p-4 mt-2'>
            <p className='font-semibold text-gray-800 mb-3'>Refine by Location</p>
            <div className='flex flex-col gap-3'>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className='border border-gray-200 rounded-lg px-3 py-2 text-sm'
              >
                <option value=''>All Countries</option>
                {countrySelectEmpty ? (
                  <option value='' disabled>
                    No data in database
                  </option>
                ) : (
                  countryOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))
                )}
              </select>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                disabled={!selectedCountry}
                className='border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400'
              >
                <option value=''>{selectedCountry ? 'All States' : 'Select Country First'}</option>
                {stateOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                className='border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400'
              >
                <option value=''>{selectedState ? 'All Cities' : 'Select State First'}</option>
                {cityOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button onClick={resetLocationFilters} className='border border-blue-200 text-blue-600 rounded-lg px-3 py-2 text-sm hover:bg-blue-50 transition-all duration-300' type='button'>
                Reset Location
              </button>
            </div>
          </div>
        </div>
        <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                scrollTo(0, 0)
              }}
              className='border border-blue-100 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] hover:shadow-lg transition-all duration-500 bg-white'
              key={index}
            >
              <img className='bg-[#CED4DA] w-full h-56 object-cover object-top' src={item.image} alt='' />
               <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>

                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>

                <div className='mt-1'>
                  {item.address?.city ? (
                    <p className='text-xs text-gray-500'>{item.address.city}, {item.address.state}</p>
                  ) : (
                    <span className='bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] font-medium inline-block'>New Doctor</span>
                  )}
                </div>

                <div className='flex items-center gap-1 mt-2 text-sm'>
                  {item.ratingCount > 0 ? (
                    <>
                      {renderStars(item.ratingAverage)}
                      <span className='text-gray-600 text-xs ml-1'>({item.ratingCount} reviews)</span>
                    </>
                  ) : (
                    <span className='text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider'>New Profile</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
