import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuariosStore = defineStore('usuarios', () => {
  // Usuarios iniciales por defecto - ADMIN ORIGINAL PROTEGIDO
  const usuariosIniciales = [
    {
      id: 999,
      nombre: 'Admin',
      apellido: 'ULEAM',
      email: 'admin@live.uleam.edu.ec',
      password: 'admin123',
      rol: 'administrador',
      estado: 'activo',
      fechaRegistro: '2024-01-01',
      tipoRegistro: 'sistema', // Protegido del sistema
    },
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@live.uleam.edu.ec',
      password: '123456',
      rol: 'usuario',
      estado: 'activo',
      fechaRegistro: '2024-05-20',
      tipoRegistro: 'sistema',
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'García',
      email: 'maria.garcia@live.uleam.edu.ec',
      password: '123456',
      rol: 'usuario',
      estado: 'activo',
      fechaRegistro: '2024-05-19',
      tipoRegistro: 'sistema',
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'Ruiz',
      email: 'carlos.ruiz@live.uleam.edu.ec',
      password: '123456',
      rol: 'usuario',
      estado: 'activo',
      fechaRegistro: '2024-05-18',
      tipoRegistro: 'sistema',
    },
  ]

  // Función para cargar usuarios desde localStorage
  const cargarUsuariosDesdeStorage = () => {
    const usuariosGuardados = localStorage.getItem('usuarios')
    if (usuariosGuardados) {
      const usuarios = JSON.parse(usuariosGuardados)

      // SIEMPRE asegurar que el admin original esté presente
      const adminOriginal = usuariosIniciales.find((u) => u.email === 'admin@live.uleam.edu.ec')
      const adminExiste = usuarios.find((u) => u.email === 'admin@live.uleam.edu.ec')

      if (!adminExiste && adminOriginal) {
        usuarios.unshift(adminOriginal) // Agregar al inicio
      }

      return usuarios
    }
    return usuariosIniciales
  }

  // Función para guardar usuarios en localStorage
  const guardarUsuariosEnStorage = (usuariosData) => {
    localStorage.setItem('usuarios', JSON.stringify(usuariosData))
  }

  // Inicializar usuarios desde localStorage o datos por defecto
  const usuarios = ref(cargarUsuariosDesdeStorage())

  const addUsuario = (userData) => {
    const newUsuario = {
      id: Date.now(),
      ...userData,
      // ✅ AUTO-APROBAR usuarios creados por admin
      estado: userData.tipoRegistro === 'admin' ? 'activo' : userData.estado || 'pendiente',
      fechaRegistro: new Date().toISOString().split('T')[0],
      tipoRegistro: userData.tipoRegistro || 'publico',
    }
    usuarios.value.push(newUsuario)
    // GUARDAR EN LOCALSTORAGE
    guardarUsuariosEnStorage(usuarios.value)
    return newUsuario
  }

  const eliminarUsuario = (id) => {
    // PROTEGER AL ADMIN ORIGINAL
    const usuario = usuarios.value.find((u) => u.id === id)
    if (usuario && usuario.email === 'admin@live.uleam.edu.ec') {
      alert('No se puede eliminar el administrador principal del sistema.')
      return
    }

    const index = usuarios.value.findIndex((u) => u.id === id)
    if (index !== -1) {
      usuarios.value.splice(index, 1)
      // GUARDAR EN LOCALSTORAGE
      guardarUsuariosEnStorage(usuarios.value)
    }
  }

  // ✅ FUNCIÓN PARA APROBAR USUARIO
  const aprobarUsuario = (id) => {
    const usuario = usuarios.value.find((u) => u.id === id)
    if (usuario) {
      usuario.estado = 'activo'
      guardarUsuariosEnStorage(usuarios.value)
    }
  }

  // ✅ FUNCIÓN PARA RECHAZAR USUARIO
  const rechazarUsuario = (id) => {
    eliminarUsuario(id) // Simplemente lo eliminamos
  }

  const getUsuariosRecientes = () => {
    return usuarios.value
      .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
      .slice(0, 5)
  }

  // ✅ FUNCIÓN: Obtener usuarios pendientes
  const getUsuariosPendientes = () => {
    return usuarios.value.filter((usuario) => usuario.estado === 'pendiente')
  }

  // ✅ FUNCIÓN: Obtener usuarios activos
  const getUsuariosActivos = () => {
    return usuarios.value.filter((usuario) => usuario.estado === 'activo')
  }

  // NUEVA FUNCIÓN: Buscar usuario por email y password
  const buscarUsuarioPorCredenciales = (email, password) => {
    return usuarios.value.find(
      (usuario) =>
        usuario.email === email && usuario.password === password && usuario.estado === 'activo',
    )
  }

  // NUEVA FUNCIÓN: Verificar si email ya existe
  const emailExiste = (email) => {
    return usuarios.value.some((usuario) => usuario.email === email)
  }

  return {
    usuarios,
    addUsuario,
    eliminarUsuario,
    aprobarUsuario,
    rechazarUsuario,
    getUsuariosRecientes,
    getUsuariosPendientes,
    getUsuariosActivos,
    buscarUsuarioPorCredenciales,
    emailExiste,
  }
})
