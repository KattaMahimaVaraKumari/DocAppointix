import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { DoctorContext } from '../../context/DoctorContext'

const urgencyBadgeStyles = {
  Red: 'bg-red-500/20 text-red-300 border border-red-400/40',
  Yellow: 'bg-amber-500/20 text-amber-200 border border-amber-300/40',
  Green: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40',
}

const VideoCall = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { backendUrl, dToken } = useContext(DoctorContext)
  const meetingContainerRef = useRef(null)

  const [appointmentData, setAppointmentData] = useState(null)
  const [doctorNotes, setDoctorNotes] = useState('')

  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

        if (!appID || !serverSecret) {
          return toast.error('Check .env: Missing AppID or Secret');
        }

        if (!meetingContainerRef.current) return;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          appointmentId, 
          Date.now().toString(),
          "Doctor" 
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // 4. Join the room
        zp.joinRoom({
          container: meetingContainerRef.current,
          sharedLinks: [
            {
              name: 'Consultation Link',
              url: window.location.origin + window.location.pathname,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
          showPreJoinView: false, 
        });

      } catch (error) {
        console.error("Zego Error:", error);
        toast.error('Video Consultation failed to start');
      }
    };

    initializeMeeting();

    return () => {
      if (meetingContainerRef.current) {
        meetingContainerRef.current.innerHTML = '';
      }
    };
  }, [appointmentId]); 

  useEffect(() => {
    const loadAppointmentData = async () => {
      if (!dToken) return
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
          headers: { dToken },
        })

        if (data.success) {
          const selectedAppointment = data.appointments.find((item) => item._id === appointmentId)
          setAppointmentData(selectedAppointment || null)
          setDoctorNotes(selectedAppointment?.notes || '')
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }

    loadAppointmentData()
  }, [appointmentId, backendUrl, dToken])

  const triageData = appointmentData?.triageData || {}
  const urgency = triageData.urgency || 'Yellow'
  const urgencyClass = urgencyBadgeStyles[urgency] || urgencyBadgeStyles.Yellow
  const finalizeConsultation = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId, notes: doctorNotes },
        { headers: { dToken } }
      )

      if (data.success) {
        toast.success('Consultation Finalized')
        navigate('/doctor-dashboard')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full h-[calc(100vh-80px)] p-5'>
      <div className='h-full grid grid-cols-1 xl:grid-cols-4 gap-4'>
        <div className='xl:col-span-3 rounded-2xl overflow-hidden border border-blue-100 shadow-xl bg-white'>
          <div ref={meetingContainerRef} className='w-full h-full min-h-[70vh]' />
        </div>

        <aside className='xl:col-span-1 bg-[#0F172A] text-slate-100 rounded-2xl border border-slate-700 shadow-xl p-4 flex flex-col'>
          <div>
            <h2 className='text-lg font-semibold'>Medical Intelligence</h2>
            <p className='text-xs text-slate-400 mt-1'>Real-time triage context for this consultation.</p>
          </div>

          <div className='mt-4 space-y-3'>
            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${urgencyClass}`}>
              Urgency: {urgency}
            </div>

            <div className='bg-slate-800/80 rounded-xl p-3 border border-slate-700'>
              <p className='text-xs text-slate-400 mb-1'>Symptoms</p>
              <p className='text-sm text-slate-200'>
                {triageData.symptomText || triageData.symptoms || 'No symptom text found for this appointment.'}
              </p>
            </div>

            <div className='bg-slate-800/80 rounded-xl p-3 border border-slate-700'>
              <p className='text-xs text-slate-400 mb-2'>AI Summary</p>
              <p className='text-sm text-slate-200'>
                {triageData.explanation || triageData.diagnosis || 'No AI triage explanation available.'}
              </p>
            </div>

            <div className='bg-slate-800/80 rounded-xl p-3 border border-slate-700'>
              <p className='text-xs text-slate-400 mb-2'>Symptom Image</p>
              {triageData.imageUrl || triageData.symptomImage ? (
                <img
                  src={triageData.imageUrl || triageData.symptomImage}
                  alt='patient symptom'
                  className='w-full h-40 object-cover rounded-lg border border-slate-600'
                />
              ) : (
                <p className='text-sm text-slate-300'>No image uploaded by patient.</p>
              )}
            </div>
          </div>

          <div className='mt-auto pt-4'>
            <p className='text-sm font-medium mb-2'>Doctor Notes</p>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              rows={6}
              placeholder='Write notes during consultation...'
              className='w-full rounded-xl bg-slate-800 border border-slate-600 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <button
              onClick={finalizeConsultation}
              className='w-full mt-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 transition-all duration-300 cursor-pointer'
            >
              Save & Complete Consultation
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default VideoCall
