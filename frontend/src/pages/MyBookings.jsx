import { useState, useEffect } from 'react'
import api from '../services/api'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings')
      console.log('Bookings response:', response.data)
      // El backend devuelve { data: Booking[], total, limit, offset }
      setBookings(response.data.data || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return

    try {
      await api.patch(`/bookings/${bookingId}`, { status: 'CANCELLED' })
      fetchBookings()
    } catch (err) {
      alert('Error al cancelar reserva')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada'
      case 'PENDING':
        return 'Pendiente'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🎫 Mis Reservas</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          No tienes reservas aún
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {booking.event.title}
                  </h2>
                  <p className="text-gray-600">{booking.event.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">📅</span>
                  {new Date(booking.event.date).toLocaleDateString('es-ES')}
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">📍</span>
                  {booking.event.location}
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">👥</span>
                  {booking.numberOfPeople} persona(s)
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-gray-700">
                  <span className="font-semibold">Total:</span>{' '}
                  ${(booking.event.price * booking.numberOfPeople).toLocaleString('es-CL')}
                </div>
                
                {booking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Cancelar Reserva
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
