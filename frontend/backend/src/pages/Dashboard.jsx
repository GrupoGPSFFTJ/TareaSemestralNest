import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bienvenido, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">
          Tu rol: <span className="font-semibold text-indigo-600">{user?.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/events"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Eventos</h2>
          <p className="text-gray-600">Explora todos los eventos disponibles</p>
        </Link>

        {user?.role === 'USER' && (
          <Link
            to="/my-bookings"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">🎫</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Mis Reservas</h2>
            <p className="text-gray-600">Gestiona tus reservas de eventos</p>
          </Link>
        )}

        {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
          <Link
            to="/create-event"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">➕</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Crear Evento</h2>
            <p className="text-gray-600">Publica un nuevo evento</p>
          </Link>
        )}

        {user?.role === 'ADMIN' && (
          <Link
            to="/users"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Usuarios</h2>
            <p className="text-gray-600">Administra usuarios del sistema</p>
          </Link>
        )}
      </div>

      <div className="mt-12 bg-indigo-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-indigo-900 mb-4">
          🚀 Funcionalidades Disponibles
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Autenticación con JWT</li>
          <li>✅ Gestión de eventos con control de aforo</li>
          <li>✅ Sistema de reservas</li>
          <li>✅ Roles y permisos</li>
          <li>✅ Estadísticas para organizadores</li>
        </ul>
      </div>
    </div>
  )
}
