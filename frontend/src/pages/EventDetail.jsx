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
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const translateCategory = (category) => {
    const translations = {
      'CONFERENCE': 'conferencia',
      'CONCERT': 'concierto',
      'WORKSHOP': 'taller',
      'SPORTS': 'deportes',
      'OTHER': 'otro',
      'charla': 'conferencia'
    }
    return translations[category] || category?.toLowerCase() || 'otro'
  }

  const getCategoryColor = (category) => {
    const translatedCategory = translateCategory(category)
    const colors = {
      'concierto': 'bg-blue-100 text-blue-700',
      'deportes': 'bg-green-100 text-green-700',
      'taller': 'bg-purple-100 text-purple-700',
      'conferencia': 'bg-orange-100 text-orange-700',
      'otro': 'bg-gray-100 text-gray-700'
    }
    return colors[translatedCategory] || 'bg-gray-100 text-gray-700'
  }

  useEffect(() => {
    fetchEvent()
  }, [id])

  useEffect(() => {
    if ((user?.role === 'admin' || user?.role === 'organizer') && id) {
      fetchBookings()
    }
  }, [id, user])

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

  const fetchBookings = async () => {
    setLoadingBookings(true)
    try {
      const response = await api.get('/bookings', { params: { eventId: id } })
      // response.data may be { data, total } or an array depending on backend
      const data = Array.isArray(response.data) ? response.data : response.data.data || []
      setBookings(data)
    } catch (err) {
      console.error('Error fetching bookings for event:', err)
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleAcceptBooking = async (bookingId) => {
    if (!confirm('¿Confirmar esta reserva?')) return
    setActionLoading(true)
    try {
      await api.patch(`/bookings/${bookingId}`, { status: 'confirmed' })
      await fetchBookings()
      fetchEvent()
    } catch (err) {
      console.error('Error confirming booking:', err)
      alert(err.response?.data?.message || 'Error al confirmar reserva')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('¿Eliminar esta reserva? Esta acción es irreversible.')) return
    setActionLoading(true)
    try {
      await api.delete(`/bookings/${bookingId}`)
      await fetchBookings()
      fetchEvent()
    } catch (err) {
      console.error('Error deleting booking:', err)
      alert(err.response?.data?.message || 'Error al eliminar reserva')
    } finally {
      setActionLoading(false)
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
            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide ${getCategoryColor(event.category)}`}>
              {translateCategory(event.category)}
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

          {/* Estado del evento */}
          {event.state !== 'published' && (user?.role === 'admin' || user?.role === 'organizer') && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Este evento está en estado: <strong className="uppercase">{event.state}</strong></span>
              </div>
              {event.state === 'draft' && (
                <button
                  onClick={async () => {
                    try {
                      await api.patch(`/events/${id}/publish`)
                      fetchEvent()
                    } catch (err) {
                      setError('Error al publicar evento')
                    }
                  }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition font-medium"
                >
                  Publicar Evento
                </button>
              )}
            </div>
          )}

            {/* Admin/Organizer actions: manage attendees and delete event */}
            {(user?.role === 'admin' || user?.role === 'organizer') && (
              <div className="ml-4 flex space-x-3">
                <button
                  onClick={() => setShowManageModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Gestionar Asistentes
                </button>

                <div>
                  <button
                    onClick={async () => {
                      const ok = window.confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.')
                      if (!ok) return

                      try {
                        await api.delete(`/events/${id}`)
                        // After successful deletion (204 No Content), navigate back to events
                        navigate('/events')
                      } catch (err) {
                        console.error('Error deleting event:', err)
                        setError(err.response?.data?.message || 'Error al eliminar evento')
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Eliminar Evento
                  </button>
                </div>
              </div>
            )}

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
              
              {user?.role === 'user' && event.state === 'published' && (
                <button
                  onClick={handleBooking}
                  className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium"
                >
                  Reservar Ahora
                </button>
              )}

              {user?.role === 'user' && event.state !== 'published' && (
                <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-lg">
                  Este evento aún no está disponible para reservas
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal: Manage attendees (admin/organizer) */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-auto max-h-[80vh]">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestionar Asistentes</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowManageModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingBookings ? (
                <div className="text-center text-gray-600">Cargando asistentes...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center text-gray-600">No hay reservas para este evento.</div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-xs text-gray-500 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2">Usuario</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Cantidad</th>
                          <th className="px-4 py-2">Estado</th>
                          <th className="px-4 py-2 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-700">
                        {bookings.map((b) => (
                          <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              {b.user?.firstName} {b.user?.lastName}
                            </td>
                            <td className="px-4 py-3">{b.user?.email}</td>
                            <td className="px-4 py-3">{b.quantity}</td>
                            <td className="px-4 py-3 capitalize">
                              <span className={
                                `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`
                              }>{b.status}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {b.status === 'pending' && (
                                  <button
                                    onClick={() => handleAcceptBooking(b.id)}
                                    disabled={actionLoading}
                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                  >
                                    Aceptar
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteBooking(b.id)}
                                  disabled={actionLoading}
                                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowManageModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
