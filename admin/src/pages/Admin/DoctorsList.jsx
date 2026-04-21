import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect , useContext } from 'react';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken])

  return (
    <div className='m-5 h-full overflow-y-auto pb-10 custom-scrollbar'>
      <h1 className='text-xl font-semibold text-slate-700'>All Doctors</h1>

      <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 pt-5'>
        {doctors.map((item, index) => (
          <div
            key={item._id || index}
            className='border border-indigo-100 rounded-xl overflow-hidden cursor-pointer group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 bg-white flex flex-col will-change-transform'
          >
            <div className='aspect-[4/5] overflow-hidden bg-slate-100'>
              <img
                loading="lazy"
                decoding="async"
                className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500'
                src={item.image}
                alt={item.name}
              />
            </div>

            <div className='p-4 flex flex-col flex-1'>
              <p className='text-neutral-800 text-base font-bold truncate'>{item.name}</p>
              <p className='text-zinc-500 text-xs mb-3'>{item.speciality}</p>

              <div className='mt-auto flex items-center gap-2'>
                <input
                  className='cursor-pointer w-4 h-4 accent-indigo-600'
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p className={`text-sm font-medium ${item.available ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList