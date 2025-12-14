import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...')
      const response = await api.get('/events')
      console.log('Events response:', response.data)
      setEvents(response.data.data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Error al cargar eventos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando eventos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🎉 Eventos Disponibles</h1>

      {events.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          No hay eventos disponibles en este momento
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(event.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    {event.location}
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">👥</span>
                    {event.capacity} personas
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">💰</span>
                    ${event.price.toLocaleString('es-CL')}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {event.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
