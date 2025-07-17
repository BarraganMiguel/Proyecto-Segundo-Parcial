<template>
  <div class="subir-revista-page">
    <AppHeader />
    <AppNavigation />

    <main>
      <section class="section">
        <div class="section-header">
          <h3>Subir Revista Científica</h3>
        </div>

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
      </section>
    </main>

    <footer>
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRevistasStore } from '../stores/revistas'
import { useAuthStore } from '../stores/auth'
import AppHeader from '../components/AppHeader.vue'
import AppNavigation from '../components/AppNavigation.vue'

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

  // Validaciones
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
    // ✅ NO HARDCODEAR - El store se encarga de asignar PDF y portada únicos
    const revistaData = {
      ...form.value,
      // ✅ REMOVIDO: portada y archivo hardcodeados
      // El store los asignará automáticamente basado en el ID
      autorId: authStore.user.id,
      autorNombre: `${authStore.user.nombre} ${authStore.user.apellido}`,
    }

    const nuevaRevista = revistasStore.addRevista(revistaData)

    alert(
      `✅ Revista "${nuevaRevista.titulo}" publicada exitosamente!\n📄 PDF asignado: ${nuevaRevista.archivo}\n🖼️ Portada asignada: ${nuevaRevista.portada}`,
    )
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = 'Error al subir la revista'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.subir-revista-page {
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px 20px;
}

.section {
  background-color: white;
  border: 3px solid #ddd;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  padding: 15px;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ddd;
}

.section-header h3 {
  font-size: 1.2rem;
  color: #333;
}

.form-container {
  padding: 20px;
}

.form-group input[type='file'] {
  padding: 3px;
}

.upload-btn {
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 12px 25px;
  font-size: 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
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
  background-color: #333;
  color: white;
  margin-top: 30px;
}
</style>
