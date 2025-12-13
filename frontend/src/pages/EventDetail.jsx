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
      setEvent(response.data)
    } catch (err) {
      setError('Error al cargar evento')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    try {
      await api.post('/bookings', {
        eventId: parseInt(id),
        numberOfPeople: 1
      })
      setBookingSuccess(true)
      setTimeout(() => {
        navigate('/my-bookings')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear reserva')
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (error && !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/events')}
        className="mb-6 text-indigo-600 hover:text-indigo-800"
      >
        ← Volver a eventos
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
        
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full">
            {event.category}
          </span>
        </div>

        <p className="text-gray-700 text-lg mb-8">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <span className="text-2xl mr-3">📅</span>
              <div>
                <p className="font-semibold">Fecha</p>
                <p>{new Date(event.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <span className="text-2xl mr-3">📍</span>
              <div>
                <p className="font-semibold">Ubicación</p>
                <p>{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <span className="text-2xl mr-3">👥</span>
              <div>
                <p className="font-semibold">Capacidad</p>
                <p>{event.capacity} personas</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <span className="text-2xl mr-3">💰</span>
              <div>
                <p className="font-semibold">Precio</p>
                <p className="text-2xl text-indigo-600">${event.price.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </div>
        </div>

        {bookingSuccess ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            ✅ ¡Reserva creada exitosamente! Redirigiendo a tus reservas...
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            {user?.role === 'USER' && (
              <button
                onClick={handleBooking}
                className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition text-lg font-semibold"
              >
                🎫 Reservar Ahora
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
