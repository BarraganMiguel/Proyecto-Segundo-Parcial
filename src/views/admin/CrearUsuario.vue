<template>
  <div class="crear-usuario">
    <AppHeader title="Revistas ULEAM - Registro" />

    <div class="container">
      <AdminSidebar />

      <main
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          width: 100%;
        "
      >
        <div class="register-box" style="max-width: 500px; width: 100%">
          <h2>Crear Usuario</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                v-model="form.nombre"
                placeholder="Ej: Juan"
                required
              />
            </div>

            <div class="form-group">
              <label for="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                v-model="form.apellido"
                placeholder="Ej: Pérez"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Correo Institucional:</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                placeholder="usuario@live.uleam.edu.ec"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                v-model="form.password"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Repetir Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="form.confirmPassword"
                placeholder="Repite tu contraseña"
                required
              />
            </div>

            <div class="form-group">
              <label for="rol">Selecciona tu rol:</label>
              <select id="rol" v-model="form.rol" required>
                <option value="" disabled>-- Selecciona un rol --</option>
                <option value="administrador">Administrador</option>
                <option value="usuario">Usuario</option>
                <option value="docente">Docente</option>
                <option value="investigador">Investigador</option>
              </select>
            </div>

            <button type="submit" :disabled="loading">
              {{ loading ? 'Creando...' : 'Crear Usuario' }}
            </button>

            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
          </form>
        </div>
      </main>
    </div>

    <footer>
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí - Sistema de Revistas</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuariosStore } from '../../stores/usuarios'
import AppHeader from '../../components/AppHeader.vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const router = useRouter()
const usuariosStore = useUsuariosStore()

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: '',
  rol: '',
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
  const emailUleam = /^[^@]+@live\.uleam\.edu\.ec$/

  // Validaciones
  if (
    !form.value.nombre ||
    !form.value.apellido ||
    !form.value.email ||
    !form.value.password ||
    !form.value.confirmPassword ||
    !form.value.rol
  ) {
    errorMessage.value = 'Todos los campos son obligatorios.'
    return
  }

  if (!soloLetras.test(form.value.nombre)) {
    errorMessage.value = 'El nombre solo debe contener letras y espacios.'
    return
  }

  if (!soloLetras.test(form.value.apellido)) {
    errorMessage.value = 'El apellido solo debe contener letras y espacios.'
    return
  }

  if (!emailUleam.test(form.value.email)) {
    errorMessage.value = 'El correo debe terminar en @live.uleam.edu.ec.'
    return
  }

  // Verificar si el email ya existe
  if (usuariosStore.emailExiste(form.value.email)) {
    errorMessage.value = 'Este correo ya está registrado.'
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  loading.value = true

  try {
    // ✅ USUARIO CREADO POR ADMIN SE APRUEBA AUTOMÁTICAMENTE
    const userData = {
      ...form.value,
      tipoRegistro: 'admin', // Marca que fue creado por admin
      estado: 'activo', // Se aprueba automáticamente
    }

    usuariosStore.addUsuario(userData)

    successMessage.value = '✅ Usuario creado y aprobado automáticamente.'

    // Limpiar formulario
    form.value = {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: '',
    }

    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push('/admin/usuarios')
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Error al crear el usuario'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.crear-usuario {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  display: flex;
  min-height: calc(100vh - 130px);
}

.register-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.register-box h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #0056b3;
}

button[type='submit'] {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover:not(:disabled) {
  background-color: #218838;
}

button[type='submit']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg {
  color: #155724;
  margin-top: 15px;
  font-size: 0.95rem;
  text-align: center;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 15px;
  border-radius: 8px;
}

footer {
  text-align: center;
  padding: 15px;
  background-color: #343a40;
  color: #fff;
}
</style>
