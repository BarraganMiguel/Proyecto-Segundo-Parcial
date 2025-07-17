<template>
  <div class="crear-revista">
    <AppHeader title="Revistas ULEAM - Subir Revista" />

    <div class="container">
      <AdminSidebar />

      <main class="main-content">
        <div class="register-box">
          <h2>Subir Revista Científica</h2>
          <form @submit.prevent="handleSubmit" class="form-container">
            <div class="form-group">
              <label for="titulo">Título de la revista:</label>
              <input type="text" id="titulo" v-model="form.titulo" required />
            </div>

            <div class="form-group">
              <label for="autores">Autores:</label>
              <input type="text" id="autores" v-model="form.autores" required />
            </div>

            <div class="form-group">
              <label for="fecha">Fecha de publicación:</label>
              <input type="date" id="fecha" v-model="form.fecha" required />
            </div>

            <div class="form-group">
              <label for="area">Área temática:</label>
              <input type="text" id="area" v-model="form.area" required />
            </div>

            <div class="form-group">
              <label for="resumen">Resumen:</label>
              <textarea id="resumen" v-model="form.resumen" rows="4" required></textarea>
            </div>

            <div class="form-group">
              <label for="palabrasclave">Palabras clave:</label>
              <input
                type="text"
                id="palabrasclave"
                v-model="form.palabrasClave"
                placeholder="Ej: salud, tecnología, educación"
                required
              />
            </div>

            <div class="form-group">
              <label for="numero">Número de páginas:</label>
              <input type="number" id="numero" v-model="form.numeroPaginas" min="1" required />
            </div>

            <div class="form-group">
              <label for="archivo">Archivo PDF:</label>
              <input type="file" id="archivo" @change="handleFileChange" accept=".pdf" required />
            </div>

            <div class="form-group">
              <label for="portada">Portada de la Revista (PNG):</label>
              <input
                type="file"
                id="portada"
                @change="handleImageChange"
                accept="image/png"
                required
              />
            </div>

            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

            <div class="form-group" style="text-align: center">
              <button type="submit" class="upload-btn" :disabled="loading">
                {{ loading ? 'Subiendo...' : 'Subir Revista' }}
              </button>
            </div>
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
import { useRevistasStore } from '../../stores/revistas'
import { useAuthStore } from '../../stores/auth'
import AppHeader from '../../components/AppHeader.vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const router = useRouter()
const revistasStore = useRevistasStore()
const authStore = useAuthStore()

const form = ref({
  titulo: '',
  autores: '',
  fecha: '',
  area: '',
  resumen: '',
  palabrasClave: '',
  numeroPaginas: '',
  archivo: null,
  portada: null,
})

const loading = ref(false)
const errorMessage = ref('')

const handleFileChange = (event) => {
  form.value.archivo = event.target.files[0]
}

const handleImageChange = (event) => {
  form.value.portada = event.target.files[0]
}

const handleSubmit = async () => {
  errorMessage.value = ''

  // Validaciones similares a SubirRevista.vue
  const soloTexto = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?!¡"-]+$/
  const soloLetrasComas = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,]+$/
  const hoy = new Date().toISOString().split('T')[0]

  if (
    !form.value.titulo ||
    !form.value.autores ||
    !form.value.fecha ||
    !form.value.area ||
    !form.value.resumen ||
    !form.value.archivo ||
    !form.value.portada
  ) {
    errorMessage.value = 'Todos los campos son obligatorios.'
    return
  }

  if (form.value.titulo.length < 5 || !soloTexto.test(form.value.titulo)) {
    errorMessage.value = 'El título debe tener al menos 5 caracteres válidos.'
    return
  }

  if (form.value.autores.length < 5 || !soloLetrasComas.test(form.value.autores)) {
    errorMessage.value = 'El nombre de autor(es) debe contener solo letras y comas.'
    return
  }

  if (!form.value.fecha || form.value.fecha > hoy) {
    errorMessage.value = 'La fecha debe ser válida y no puede ser futura.'
    return
  }

  if (form.value.resumen.length < 20) {
    errorMessage.value = 'El resumen debe tener al menos 20 caracteres.'
    return
  }

  if (form.value.archivo.type !== 'application/pdf') {
    errorMessage.value = 'Solo se permiten archivos en formato PDF.'
    return
  }

  if (form.value.archivo.size > 10 * 1024 * 1024) {
    errorMessage.value = 'El archivo no debe superar los 10MB.'
    return
  }

  if (form.value.portada.type !== 'image/png') {
    errorMessage.value = 'La portada debe ser una imagen PNG.'
    return
  }

  loading.value = true

  try {
    const revistaData = {
      ...form.value,
      portada: '/RevistaEducacion.jpg',
      archivo: '/PDF REVISTAS/Revista de Ciencias Marinas.pdf',
      estado: 'aprobada', // Admin puede aprobar directamente
      autorId: authStore.user.id, // ✅ ID del usuario admin actual
      autorNombre: `${authStore.user.nombre} ${authStore.user.apellido}`, // Para referencia
    }

    revistasStore.addRevista(revistaData)

    alert('Revista subida exitosamente.')
    router.push('/admin/revistas')
  } catch (error) {
    errorMessage.value = 'Error al subir la revista'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.crear-revista {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  display: flex;
  min-height: calc(100vh - 130px);
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
}

.register-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.register-box h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #0056b3;
}

.upload-btn {
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

.upload-btn:hover:not(:disabled) {
  background-color: #218838;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

footer {
  text-align: center;
  padding: 15px;
  background-color: #343a40;
  color: #fff;
}
</style>
