import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const RateAppointment = ({ appointmentId, backendUrl, token, onRated }) => {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const submitRating = async () => {
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating first')
      return
    }

    try {
      setSubmitting(true)
      const { data } = await axios.post(
        `${backendUrl}/api/user/rate-appointment`,
        { appointmentId, rating },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        onRated()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='sm:min-w-48 border border-blue-100 rounded-xl p-3 bg-white shadow-sm'>
      <p className='text-xs text-gray-500 mb-2'>Rate Appointment</p>
      <div className='flex items-center gap-1 mb-3'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type='button'
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className='text-xl leading-none cursor-pointer'
          >
            <span className={(hovered || rating) >= star ? 'text-amber-400' : 'text-gray-300'}>&#9733;</span>
          </button>
        ))}
      </div>
      <button
        onClick={submitRating}
        disabled={submitting}
        className='w-full text-sm py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  )
}

export default RateAppointment
