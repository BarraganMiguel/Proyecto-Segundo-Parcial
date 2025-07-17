import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUsuariosStore } from './usuarios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.rol === 'administrador')

  const login = async (email, password) => {
    // Obtener el store de usuarios
    const usuariosStore = useUsuariosStore()

    // Buscar usuario en la base de datos
    const usuarioEncontrado = usuariosStore.buscarUsuarioPorCredenciales(email, password)

    if (usuarioEncontrado) {
      // Usuario encontrado y credenciales correctas
      user.value = {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        apellido: usuarioEncontrado.apellido,
        email: usuarioEncontrado.email,
        rol: usuarioEncontrado.rol,
      }
      localStorage.setItem('user', JSON.stringify(user.value))

      return {
        success: true,
        isAdmin: usuarioEncontrado.rol === 'administrador',
      }
    } else {
      // Verificar si el usuario existe pero está pendiente
      const usuarioPendiente = usuariosStore.usuarios.find(
        (u) => u.email === email && u.password === password && u.estado === 'pendiente',
      )

      if (usuarioPendiente) {
        return {
          success: false,
          message: 'Tu cuenta está pendiente de aprobación por el administrador',
        }
      }

      // Usuario no encontrado o credenciales incorrectas
      return {
        success: false,
        message: 'Credenciales incorrectas o usuario no registrado',
      }
    }
  }

  const register = async (userData) => {
    // El registro público ahora funciona
    const usuariosStore = useUsuariosStore()

    // Verificar si el email ya existe
    if (usuariosStore.emailExiste(userData.email)) {
      return {
        success: false,
        message: 'El email ya está registrado',
      }
    }

    const newUser = usuariosStore.addUsuario({
      ...userData,
      estado: 'pendiente', // Los usuarios públicos quedan pendientes
      tipoRegistro: 'publico',
    })

    return { success: true, user: newUser }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
  }
})
