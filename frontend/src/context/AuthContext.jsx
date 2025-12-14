import { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('Intentando login con:', email)
      const response = await api.post('/auth/login', { email, password })
      console.log('Respuesta login:', response.data)
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      console.log('Obteniendo perfil...')
      const profileResponse = await api.get('/auth/profile')
      console.log('Respuesta perfil:', profileResponse.data)
      const userData = profileResponse.data
      
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' }
    }
  }

  const register = async (data) => {
    try {
      const response = await api.post('/auth/register', data)
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      const profileResponse = await api.get('/auth/profile')
      const userData = profileResponse.data
      
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al registrarse' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  return useContext(AuthContext)
}
