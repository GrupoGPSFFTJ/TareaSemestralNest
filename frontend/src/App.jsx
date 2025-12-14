import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PropTypes from 'prop-types'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'
import MyBookings from './pages/MyBookings'
import Users from './pages/Users'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  
  console.log('PrivateRoute - User:', user)
  
  return user ? children : <Navigate to="/login" />
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

function App() {
  const { user } = useAuth()

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && <Navbar />}
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          
          <Route path="/events" element={
            <PrivateRoute><Events /></PrivateRoute>
          } />
          
          <Route path="/events/:id" element={
            <PrivateRoute><EventDetail /></PrivateRoute>
          } />
          
          <Route path="/create-event" element={
            <PrivateRoute><CreateEvent /></PrivateRoute>
          } />
          
          <Route path="/my-bookings" element={
            <PrivateRoute><MyBookings /></PrivateRoute>
          } />
          
          <Route path="/users" element={
            <PrivateRoute><Users /></PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
