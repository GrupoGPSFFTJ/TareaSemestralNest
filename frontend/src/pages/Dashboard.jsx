import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()

  const cards = [
    {
      title: 'Eventos',
      description: 'Explora todos los eventos disponibles',
      link: '/events',
      show: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Mis Reservas',
      description: 'Gestiona tus reservas de eventos',
      link: '/my-bookings',
      show: user?.role === 'user',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Crear Evento',
      description: 'Publica un nuevo evento',
      link: '/create-event',
      show: user?.role === 'organizer' || user?.role === 'admin',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Usuarios',
      description: 'Administra usuarios del sistema',
      link: '/users',
      show: user?.role === 'admin',
      color: 'from-gray-700 to-gray-800'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Bienvenido, {user?.firstName}
          </h1>
          <p className="text-gray-600 text-lg">
            Rol: <span className="font-semibold text-gray-900 capitalize">{user?.role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.filter(card => card.show).map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${card.color}`}></div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Funcionalidades del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Autenticación con JWT',
              'Gestión de eventos con control de aforo',
              'Sistema de reservas',
              'Roles y permisos',
              'Estadísticas para organizadores',
              'Persistencia en base de datos'
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2"></div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
