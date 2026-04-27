import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const AppointmentDetails = () => {
  const { id } = useParams()
  const { aToken, backendUrl } = useContext(AdminContext)
  const [appointment, setAppointment] = useState(null)

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/appointment/${id}`, {
          headers: { aToken }
        })
        if (data.success) {
          setAppointment(data.appointment)
        }
      } catch (error) {
        console.error('Appointment fetch failed', error)
      }
    }

    if (id && aToken && backendUrl) {
      fetchAppointment()
    }
  }, [id, aToken, backendUrl])

  if (!appointment) return <div className='w-full max-w-4xl m-5 p-6'>Loading appointment details...</div>

  const recoveryLogs = Array.isArray(appointment.recoveryLogs) ? appointment.recoveryLogs : []
  console.log('Recovery Data:', recoveryLogs)

  const baselineScores = [2, 5, 4, 7, 8]
  const formattedRecovery = recoveryLogs.length > 1 ? recoveryLogs : baselineScores.map((score, index) => ({ date: `Baseline ${index + 1}`, healthScore: score }))
  const chartData = recoveryLogs.length > 1 ? recoveryLogs : formattedRecovery

  const labels = chartData.map((log) => new Date(log.date).toLocaleDateString())
  const scores = chartData.map((log) => log.healthScore)

  const data = {
    labels,
    datasets: [
      {
        label: 'Health Score',
        data: scores,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(37, 99, 235)',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: recoveryLogs.length > 0 ? 'Patient Recovery Trend' : 'Baseline Recovery Chart',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} / 10`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className='w-full max-w-4xl m-5 bg-white rounded-lg shadow-lg p-6'>
      <h1 className='text-2xl font-bold text-blue-900 mb-4'>Appointment Details</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div>
          <h2 className='text-lg font-semibold text-blue-800'>Patient</h2>
          <p className='text-blue-700'>{appointment.userData?.name || 'Unknown patient'}</p>
        </div>
        <div>
          <h2 className='text-lg font-semibold text-blue-800'>Doctor</h2>
          <p className='text-blue-700'>{appointment.docData?.name || 'Unknown doctor'}</p>
        </div>
      </div>
      <div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
        <h2 className='text-lg font-semibold text-blue-900 mb-4'>Recovery Trend Chart</h2>
        <div className='h-[300px]'>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetails