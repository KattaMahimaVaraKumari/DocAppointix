import React, { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const urgencyStyles = {
  Red: 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] bg-red-50',
  Yellow: 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] bg-amber-50',
  Green: 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.25)] bg-emerald-50',
}

const disclaimerKey = 'docappointix_ai_disclaimer_ack'

const AiAssistant = () => {
  const navigate = useNavigate()
  const { backendUrl, doctors } = useContext(AppContext)
  const [symptoms, setSymptoms] = useState('')
  const [imageBase64, setImageBase64] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(
    localStorage.getItem(disclaimerKey) === 'true'
  )

  const availableDoctorsCount = useMemo(
    () => doctors.filter((doc) => doc.available).length,
    [doctors]
  )

  const lateNightMessage = useMemo(() => {
    const hour = new Date().getHours()

    if (hour >= 22 || hour < 6) {
      if (availableDoctorsCount === 0) {
        return 'It is late right now and no doctors are currently available.'
      }

      return `It is late right now, but ${availableDoctorsCount} doctors are available.`
    }

    return ''
  }, [availableDoctorsCount])

  const handleImageUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result
      setImageBase64(base64)
      setPreviewImage(base64)
    }
    reader.readAsDataURL(file)
  }

  const submitTriage = async () => {
    if (!symptoms.trim() && !imageBase64) {
      return toast.error('Please describe symptoms or upload an image')
    }

    try {
      setLoading(true)
      const { data } = await axios.post(`${backendUrl}/api/ai/triage`, {
        symptoms: symptoms.trim(),
        imageBase64,
      })

      if (data.success) {
        setResult(data.triage)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const acknowledgeDisclaimer = () => {
    localStorage.setItem(disclaimerKey, 'true')
    setAcceptedDisclaimer(true)
  }

  const goToSpeciality = () => {
    if (!result?.specialty) return
    navigate(`/doctors/${result.specialty}`)
    scrollTo(0, 0)
  }

  return (
    <div className='max-w-5xl mx-auto my-8'>
      {!acceptedDisclaimer && (
        <div className='mb-5 border border-blue-200 bg-blue-50 rounded-2xl p-4 shadow-sm'>
          <p className='text-sm text-blue-900'>
            AI triage is a guidance tool, not a final medical diagnosis. For severe symptoms, seek
            emergency care immediately.
          </p>
          <button
            onClick={acknowledgeDisclaimer}
            className='mt-3 px-4 py-2 text-sm rounded-lg border border-blue-400 text-blue-700 hover:bg-blue-100 transition-all duration-300 cursor-pointer'
          >
            I Understand
          </button>
        </div>
      )}

      <div className='bg-white rounded-3xl border border-blue-100 shadow-xl p-6 md:p-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 text-center'>
          DocAppointix AI Triage & Vision Assistant
        </h1>
        <p className='text-sm text-gray-500 text-center mt-2'>
          Describe symptoms, upload an image, and get smart urgency triage with specialist guidance.
        </p>

        <div className='grid md:grid-cols-2 gap-6 mt-8'>
          <div>
            <label className='text-sm font-medium text-gray-700'>Describe your symptoms</label>
            <textarea
              rows={8}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder='Example: Itchy red bumps on forearm since yesterday, mild burning sensation...'
              className='w-full mt-2 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>Upload image (optional)</label>
            <label className='mt-2 border-2 border-dashed border-blue-200 rounded-xl p-5 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-blue-50 transition-all duration-300'>
              <span className='text-3xl' role='img' aria-label='camera'>
                📷
              </span>
              <p className='mt-2 text-sm'>Tap to upload skin/symptom image</p>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
              />
            </label>
            {previewImage && (
              <img src={previewImage} alt='symptom preview' className='w-full h-48 object-cover rounded-xl mt-3 border border-gray-200' />
            )}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-3 mt-6'>
          <button
            onClick={submitTriage}
            disabled={loading}
            className='px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 disabled:opacity-70 cursor-pointer'
          >
            {loading ? 'Analyzing...' : 'Run Smart Triage'}
          </button>
          <button
            onClick={() => {
              setSymptoms('')
              setImageBase64('')
              setPreviewImage('')
              setResult(null)
            }}
            className='px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300 cursor-pointer'
          >
            Reset
          </button>
        </div>

        {lateNightMessage && (
          <p className='mt-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
            {lateNightMessage}
          </p>
        )}

        {result && (
          <div className={`mt-8 border-2 rounded-2xl p-5 ${urgencyStyles[result.urgency] || urgencyStyles.Green}`}>
            <div className='flex items-center justify-between flex-wrap gap-2'>
              <h2 className='text-xl font-semibold text-gray-900'>AI Triage Result</h2>
              <span className='px-3 py-1 rounded-full text-xs font-bold bg-white border border-gray-300'>
                Urgency: {result.urgency}
              </span>
            </div>

            <div className='mt-4 space-y-3 text-sm text-gray-700'>
              <p><span className='font-semibold text-gray-900'>Likely Condition:</span> {result.diagnosis}</p>
              <p><span className='font-semibold text-gray-900'>Why:</span> {result.explanation}</p>
              <p><span className='font-semibold text-gray-900'>Recommended Specialty:</span> {result.specialty}</p>
            </div>

            {result.home_care && (
              <div className='mt-4 bg-white border border-gray-200 rounded-xl p-4'>
                <p className='font-semibold text-gray-900 mb-2'>Step-by-step Home Care</p>
                <ol className='list-decimal list-inside text-sm text-gray-700 space-y-1'>
                  {result.home_care
                    .split('\n')
                    .map((step) => step.trim())
                    .filter(Boolean)
                    .map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                </ol>
              </div>
            )}

            <div className='mt-5 flex flex-wrap gap-3'>
              <button
                onClick={goToSpeciality}
                className='px-5 py-2.5 rounded-lg bg-[#1D4ED8] text-white hover:bg-[#1E40AF] transition-all duration-300 cursor-pointer'
              >
                Find {result.specialty} Doctors
              </button>
              <button
                onClick={() => navigate('/doctors')}
                className='px-5 py-2.5 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300 cursor-pointer'
              >
                Browse All Doctors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiAssistant
