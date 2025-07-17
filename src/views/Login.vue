<template>
  <div class="login-page">
    <main class="login-box">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Correo Electrónico:</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email"
            placeholder="ejemplo@live.uleam.edu.ec" 
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
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
        
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
      </form>
      
      <p class="extra-link">
        ¿No tienes cuenta? 
        <router-link to="/registro">Regístrate aquí</router-link>
      </p>
      
      <div class="back-button">
        <router-link to="/">← Volver al Inicio</router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  
  // Validaciones
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Por favor, complete todos los campos.'
    return
  }

  const emailUleam = /^[^@]+@live\.uleam\.edu\.ec$/
  if (!emailUleam.test(form.value.email)) {
    errorMessage.value = 'El correo debe terminar en @live.uleam.edu.ec.'
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  loading.value = true
  
  try {
    const result = await authStore.login(form.value.email, form.value.password)
    
    if (result.success) {
      if (result.isAdmin) {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    } else {
      errorMessage.value = result.message || 'Error al iniciar sesión'
    }
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80') no-repeat center/cover fixed;
}

.login-box {
  background: rgba(255,255,255,0.95);
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(52,58,64,0.1);
  max-width: 400px;
  width: 100%;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #0056b3;
}

button[type="submit"] {
  width: 100%;
  height: 42px;
  background: #0056b3;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover:not(:disabled) {
  background: #004494;
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.extra-link, .back-button {
  text-align: center;
  margin-top: 15px;
  font-size: 0.95rem;
}

.extra-link a, .back-button a {
  color: #0056b3;
  text-decoration: none;
  font-weight: bold;
}

.back-button a {
  background: #17a2b8;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  display: inline-block;
  transition: background-color 0.3s;
}

.back-button a:hover {
  background: #138496;
}
</style>
