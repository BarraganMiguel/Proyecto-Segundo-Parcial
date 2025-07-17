<template>
  <div class="registro-page">
    <main class="register-box">
      <h2>Registrarse</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="form.nombre" placeholder="Ej: Juan" required />
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
            <option value="usuario">Usuario/Estudiante</option>
            <option value="docente">Docente</option>
            <option value="investigador">Investigador</option>
          </select>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrar' }}
        </button>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
      </form>

      <p class="extra-link">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión aquí</router-link>
      </p>

      <div class="back-button">
        <router-link to="/">← Volver al Inicio</router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUsuariosStore } from '../stores/usuarios'

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

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validaciones
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
  const emailUleam = /^[^@]+@live\.uleam\.edu\.ec$/

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
    // Registrar usuario con estado "pendiente" para aprobación del admin
    const userData = {
      ...form.value,
      estado: 'pendiente', // Los usuarios auto-registrados quedan pendientes
      tipoRegistro: 'publico', // Para distinguir de los creados por admin
    }

    usuariosStore.addUsuario(userData)

    successMessage.value =
      '✅ ¡Registro exitoso! Tu cuenta está pendiente de aprobación por el administrador. Puedes cerrar esta ventana.'

    // Limpiar formulario
    form.value = {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: '',
    }

    // ❌ REMOVIDO: Ya no hay redirección automática
    // El usuario decide cuándo ir al login manualmente
  } catch (error) {
    errorMessage.value = 'Error al crear la cuenta'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.registro-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.register-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(52, 58, 64, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-box h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #0056b3;
}

button[type='submit'] {
  width: 100%;
  height: 42px;
  padding: 0 10px;
  background-color: #0056b3;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover:not(:disabled) {
  background-color: #004494;
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
  line-height: 1.4;
}

.extra-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.95rem;
}

.extra-link a {
  color: #0056b3;
  text-decoration: none;
  font-weight: bold;
}

.extra-link a:hover {
  text-decoration: underline;
}

.back-button {
  text-align: center;
  margin-top: 15px;
}

.back-button a {
  background: #17a2b8;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  display: inline-block;
  transition: background-color 0.3s;
  text-decoration: none;
}

.back-button a:hover {
  background: #138496;
}
</style>
