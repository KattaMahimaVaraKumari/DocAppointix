import React from 'react'
import { useContext } from 'react'
import { use } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'

const DoctorAppointments = () => {

  const { dToken,appointments, setAppontments, getAppointments } = useContext(DoctorContext);

  useEffect(()=>{
    if(dToken){
      getAppointments();
    }
  },[dToken])

  return (
    <div>
      
    </div>
  )
}

export default DoctorAppointments
