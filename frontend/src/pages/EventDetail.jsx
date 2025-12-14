import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function EventDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`)
      console.log('Event detail response:', response.data)
      setEvent(response.data)
    } catch (err) {
      console.error('Error fetching event:', err)
      setError('Error al cargar evento')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    try {
      console.log('Creating booking for event:', id, 'user:', user.id)
      await api.post('/bookings', {
        userId: user.id,
        eventId: parseInt(id),
        quantity: 1
      })
      setBookingSuccess(true)
      setTimeout(() => {
        navigate('/my-bookings')
      }, 2000)
    } catch (err) {
      console.error('Error creating booking:', err)
      setError(err.response?.data?.message || 'Error al crear reserva')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/events')}
          className="mb-8 text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver a eventos</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium uppercase tracking-wide">
              {event.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{event.title}</h1>
          <p className="text-gray-700 text-lg mb-8">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha y hora</p>
                  <p className="text-lg font-medium text-gray-900">{new Date(event.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ubicación</p>
                  <p className="text-lg font-medium text-gray-900">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Capacidad</p>
                  <p className="text-lg font-medium text-gray-900">{event.capacity} personas</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Precio</p>
                  <p className="text-3xl font-bold text-gray-900">${event.price.toLocaleString('es-CL')}</p>
                </div>
              </div>
            </div>
          </div>

          {bookingSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>¡Reserva creada exitosamente! Redirigiendo a tus reservas...</span>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              {user?.role === 'user' && (
                <button
                  onClick={handleBooking}
                  className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium"
                >
                  Reservar Ahora
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
