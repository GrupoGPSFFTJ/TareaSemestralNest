import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Eventos Disponibles</h1>
          <p className="text-gray-600">Explora y reserva los mejores eventos</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No hay eventos disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-wide ${getCategoryColor(event.category)}`}>
                      {translateCategory(event.category)}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-2 text-sm">{event.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.capacity}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ${event.price.toLocaleString('es-CL')}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
