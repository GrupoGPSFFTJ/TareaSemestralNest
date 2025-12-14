import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  
  console.log('Navbar - User:', user)
  console.log('Navbar - User role:', user?.role)

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-2xl font-bold">
            🎫 Eventix
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/events" className="hover:text-indigo-200">Eventos</Link>
            
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <Link to="/create-event" className="hover:text-indigo-200">Crear Evento</Link>
            )}
            
            {user?.role === 'user' && (
              <Link to="/my-bookings" className="hover:text-indigo-200">Mis Reservas</Link>
            )}
            
            {user?.role === 'admin' && (
              <Link to="/users" className="hover:text-indigo-200">Usuarios</Link>
            )}
            
            <div className="border-l border-indigo-400 pl-6 flex items-center space-x-4">
              <span className="text-sm">
                {user?.firstName} {user?.lastName} 
                <span className="ml-2 px-2 py-1 bg-indigo-800 rounded text-xs">
                  {user?.role}
                </span>
              </span>
              <button
                onClick={logout}
                className="bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded"
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
