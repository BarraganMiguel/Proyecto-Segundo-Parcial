<template>
  <div class="dashboard">
    <div class="background-overlay"></div>

    <AppHeader />
    <AppNavigation />

    <main>
      <section class="welcome-section">
        <h2>Bienvenido, {{ authStore.user?.nombre }}</h2>
        <p>Explora las últimas publicaciones científicas de ULEAM</p>
      </section>

      <section class="section">
        <div class="section-header">
          <h3>Revistas Destacadas</h3>
          <span class="stats-info">📊 Total: {{ revistasDestacadas.length }}</span>
        </div>
        <div class="journals-slider">
          <div v-for="revista in revistasDestacadas" :key="revista.id" class="journal-card">
            <img :src="revista.portada" :alt="revista.titulo" />
            <h4>{{ revista.titulo }}</h4>
            <p>{{ formatDate(revista.fecha) }}</p>
            <router-link to="/revistas" class="view-btn">Ver revista</router-link>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h3>Mis Publicaciones</h3>
          <span class="user-info-debug">
            👤 Usuario ID: {{ authStore.user?.id }} | Total revistas: {{ misPublicaciones.length }}
          </span>
        </div>
        <div class="revistas-grid">
          <div v-for="revista in misPublicaciones" :key="revista.id" class="journal-card">
            <img :src="revista.portada" :alt="revista.titulo" />
            <h4>{{ revista.titulo }}</h4>
            <p>{{ formatDate(revista.fecha) }}</p>
            <p class="estado-badge" :class="revista.estado">
              📋 Estado: {{ revista.estado === 'aprobada' ? 'Aprobada' : 'Pendiente' }}
            </p>
            <a
              v-if="revista.estado === 'aprobada'"
              :href="revista.archivo"
              class="view-btn"
              :download="revista.archivoOriginal?.nombre || `${revista.titulo}.pdf`"
              @click="descargarArchivo(revista)"
            >
              <i class="fas fa-download"></i> Descargar PDF
            </a>
            <span v-else class="view-btn disabled"> ⏳ En revisión </span>
          </div>

          <div v-if="misPublicaciones.length === 0" class="no-publications">
            <p>Aún no tienes publicaciones</p>
            <router-link to="/subir-revista" class="btn btn-primary">
              Subir tu primera revista
            </router-link>
          </div>
        </div>
      </section>

      <section class="section upload-section">
        <div class="section-header">
          <h3>¿Deseas compartir tu trabajo?</h3>
        </div>
        <div style="text-align: center; padding: 20px">
          <router-link to="/subir-revista" class="upload-btn">
            ¡Sube tu revista científica ahora!
          </router-link>
        </div>
      </section>
    </main>

    <footer>
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRevistasStore } from '../stores/revistas'
import AppHeader from '../components/AppHeader.vue'
import AppNavigation from '../components/AppNavigation.vue'

const authStore = useAuthStore()
const revistasStore = useRevistasStore()

// ✅ CORREGIDO: Mostrar TODAS las revistas aprobadas, no solo 4
const revistasDestacadas = computed(() => {
  const aprobadas = revistasStore.getRevistasAprobadas()
  console.log('📊 Revistas aprobadas para destacadas:', aprobadas.length)
  return aprobadas // ✅ Mostrar todas, no .slice(0, 4)
})

const misPublicaciones = computed(() => {
  const publicaciones = revistasStore.getRevistasByUser(authStore.user?.id)
  console.log(`📚 Publicaciones del usuario ${authStore.user?.nombre}:`, publicaciones)
  return publicaciones
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  console.log('🔍 Usuario actual:', authStore.user)
  console.log('📖 Todas las revistas:', revistasStore.revistas)
})

const descargarArchivo = (revista) => {
  // Si es un archivo base64, crear un enlace de descarga temporal
  if (revista.archivo && revista.archivo.startsWith('data:')) {
    const link = document.createElement('a')
    link.href = revista.archivo
    link.download = revista.archivoOriginal?.nombre || `${revista.titulo}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

main {
  flex: 1;
  max-width: 1400px;
  width: 95%;
  margin: 0 auto;
  padding: 0 30px;
}

.welcome-section {
  background-color: white;
  border: 3px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  border-radius: 8px;
  width: 100%;
}

.welcome-section h2 {
  margin-bottom: 10px;
  color: #0056b3;
}

.section {
  background-color: white;
  border: 3px solid #ddd;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
}

.section-header {
  padding: 15px 25px;
  border-bottom: 1px solid #ddd;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: 1.2rem;
  color: #333;
}

.stats-info {
  font-size: 0.9rem;
  color: #0056b3;
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.user-info-debug {
  font-size: 0.8rem;
  color: #666;
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
}

.journals-slider {
  display: flex;
  overflow-x: auto;
  padding: 15px 25px;
  gap: 15px;
}

.revistas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 25px;
  justify-content: flex-start; /* ✅ CORREGIDO: Alinear a la izquierda, no space-between */
}

.journal-card {
  min-width: 220px;
  width: 240px;
  border: 1px solid #eee;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.journal-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 4px;
}

.journal-card h4 {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #333;
}

.journal-card p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.estado-badge {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  margin-bottom: 10px;
  display: inline-block;
}

.estado-badge.aprobada {
  background: #d4edda;
  color: #155724;
}

.estado-badge.pendiente {
  background: #fff3cd;
  color: #856404;
}

.view-btn {
  display: inline-block;
  background-color: #0056b3;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.view-btn:hover {
  background-color: #004494;
}

.view-btn.disabled {
  background-color: #6c757d;
  cursor: not-allowed;
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
}

.upload-btn:hover {
  background-color: #218838;
}

.no-publications {
  text-align: center;
  padding: 40px;
  color: #666;
  width: 100%;
}

.no-publications p {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

footer {
  text-align: center;
  padding: 15px;
  background-color: #333;
  color: white;
  margin-top: auto;
}

/* Responsive */
@media (min-width: 1200px) {
  main {
    max-width: 1600px;
  }

  .journal-card {
    width: calc(25% - 15px);
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .journal-card {
    width: calc(33.333% - 14px);
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  main {
    max-width: 95%;
    padding: 0 20px;
  }

  .journal-card {
    width: calc(50% - 10px);
  }
}

@media (max-width: 767px) {
  main {
    max-width: 100%;
    padding: 0 15px;
  }

  .section-header {
    padding: 15px;
  }

  .journals-slider,
  .revistas-grid {
    padding: 15px;
  }

  .journal-card {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
