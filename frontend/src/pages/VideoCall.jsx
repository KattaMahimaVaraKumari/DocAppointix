import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

const VideoCall = () => {
  const { appointmentId } = useParams()
  const meetingContainerRef = useRef(null)

  useEffect(() => {
    const initializeMeeting = () => {
      try {
        const appID = Number(import.meta.env.VITE_ZEGO_APP_ID)
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET

        if (!appID || !serverSecret) {
          return toast.error('Missing Zego credentials in .env')
        }
        if (!meetingContainerRef.current) return

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          appointmentId,
          Date.now().toString(),
          'Patient'
        )

        const zp = ZegoUIKitPrebuilt.create(kitToken)
        zp.joinRoom({
          container: meetingContainerRef.current,
          sharedLinks: [
            {
              name: 'Consultation Link',
              url: window.location.origin + window.location.pathname,
            },
          ],
          scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
          showScreenSharingButton: true,
          showPreJoinView: false,
        })
      } catch (error) {
        console.log(error)
        toast.error('Unable to join consultation')
      }
    }

    initializeMeeting()

    return () => {
      if (meetingContainerRef.current) {
        meetingContainerRef.current.innerHTML = ''
      }
    }
  }, [appointmentId])

  return (
    <div className='w-full h-[calc(100vh-110px)] bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden'>
      <div ref={meetingContainerRef} className='w-full h-full min-h-[70vh]' />
    </div>
  )
}

export default VideoCall
