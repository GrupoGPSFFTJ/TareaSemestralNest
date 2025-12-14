import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-semibold text-gray-900 tracking-tight">
            Eventix
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/events" className="text-gray-700 hover:text-gray-900 font-medium transition">Eventos</Link>
            
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <Link to="/create-event" className="text-gray-700 hover:text-gray-900 font-medium transition">Crear Evento</Link>
            )}
            
            {user?.role === 'user' && (
              <Link to="/my-bookings" className="text-gray-700 hover:text-gray-900 font-medium transition">Mis Reservas</Link>
            )}
            
            {user?.role === 'admin' && (
              <Link to="/users" className="text-gray-700 hover:text-gray-900 font-medium transition">Usuarios</Link>
            )}
            
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-8">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
              </div>
              <button
                onClick={logout}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
