import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {
  const {docId}=useParams();
  const {doctors,currencySymbol, backendUrl, token, getDoctorsData}=useContext(AppContext)
  const daysOfWeek=['SUN','MON','TUE','WED','THU','FRI','SAT']

  const navigate= useNavigate()

  const [docInfo,setDocInfo]=useState(null)
  const [docSlots,setDocSlots]=useState([])
  const [slotIndex,setSlotIndex]=useState(0);
  const [slotTime,setSlotTime]=useState('')
  const triageStorageKey = 'docappointix_pending_triage'

  const renderStars = (ratingAverage = 0) => {
    const fullStars = Math.round(ratingAverage)
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= fullStars ? 'text-amber-400' : 'text-gray-300'}>&#9733;</span>
    ))
  }
  
  const fetchDocInfo=async()=>{
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots=async()=>{
    if (!docInfo) return; 

    setDocSlots([])

    //getting current date
    let today=new Date()

    for(let i=0;i<7;i++){
      //getting date
      let currentDate=new Date();
      currentDate.setDate(today.getDate()+i)

      //setting end time of the date
      let endTime=new Date();
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      //setting hours
      if(today.getDate()=== currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>10? currentDate.getHours()+1:10)
        currentDate.setMinutes(currentDate.getMinutes()>30?30:0)
      }
      else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots=[]

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        
       const isSlotAvailable = docInfo.slots_booked && docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }
        
        currentDate.setMinutes(currentDate.getMinutes()+30)
      }

      setDocSlots(prev=>([...prev,timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }
    try {
      const date = docSlots[slotIndex][0].datetime;

      if (!date) {
          return toast.error("No slots available for this day");
      }
      
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const storedTriage = localStorage.getItem(triageStorageKey)
      const triageData = storedTriage ? JSON.parse(storedTriage) : {}

      const {data}= await axios.post(
        backendUrl+'/api/user/book-appointment',
        {docId,slotDate,slotTime,triageData},
        {headers:{token}}
      );
      if(data.success){
        toast.success(data.message);
        localStorage.removeItem(triageStorageKey)
        getDoctorsData();
        navigate('/my-appointments')
      }
      else{
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    
  },[docSlots])

  return docInfo && (
    <div>
      {/* Doctor Details  */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-[#ADB5BD] sm:max-w-72 rounded' src={docInfo.image} alt="docInfo image" />
        </div>
        <div className='flex-1 border border-gray-300 rounded p-8 py-7 bg-white mx-2 sm:mx-9 mt-[-80px] sm:mt-0 shadow-lg'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="verified icon" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full cursor-pointer'>{docInfo.experience}</button>
          </div>
          <div className='flex items-center gap-2 mt-2'>
            <div className='flex items-center text-sm'>{renderStars(docInfo.ratingAverage)}</div>
            <p className='text-sm text-gray-500'>{docInfo.ratingAverage || 0} ({docInfo.ratingCount || 0} reviews)</p>
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            {docInfo.address?.city ? `${docInfo.address.city}, ${docInfo.address.state}` : 'Location Pending'}
          </p>

          {/* Doctor About  */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About 
              <img src={assets.info_icon} alt="info icon" />
              </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='font-medium text-gray-500 mt-4'>
            Appointment fee : <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* BOOKING SLOTS  */}
      <div className='sm:ml-72 sm:pl-4 font-medium text-gray-700'>
        <p className='mt-6'>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index? 'bg-[#ADB5BD] text-white': 'border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
           {
             docSlots.length && docSlots[slotIndex].map((item,index)=>(
               <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime?'bg-[#ADB5BD] text-white font-medium':"border border-gray-300 text-gray-500"}`} key={index}>
                  {item.time}
               </p>
              ))
           }
        </div>
        
        <button onClick={()=>bookAppointment()} className='bg-[#ADB5BD] text-white text-sm font-medium px-14 py-3 rounded-xl my-6 cursor-pointer'>Book an appointment</button>

      </div>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
      
    </div>
  )
}

export default Appointment
