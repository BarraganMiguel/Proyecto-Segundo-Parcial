<template>
  <div class="admin-revistas">
    <AppHeader title="Revistas ULEAM - Administración" />

    <div class="container">
      <AdminSidebar />

      <main>
        <div class="create-magazine-section">
          <router-link to="/admin/crear-revista" class="btn btn-success">
            <i class="fas fa-plus"></i> Subir Revista
          </router-link>
        </div>

        <div class="magazine-grid">
          <div v-for="revista in revistasAprobadas" :key="revista.id" class="magazine-card">
            <img :src="revista.portada" :alt="revista.titulo" />
            <div class="magazine-card-body">
              <h4>{{ revista.titulo }}</h4>
              <p>{{ revista.resumen.substring(0, 100) }}...</p>
              <div class="magazine-actions">
                <span class="date">Publicado: {{ formatDate(revista.fecha) }}</span>
                <div>
                  <button @click="eliminarRevista(revista.id)" class="btn btn-danger">
                    <i class="fas fa-trash"></i> Eliminar
                  </button>
                  <a href="#" class="btn btn-success2" @click="descargarArchivo(revista)">
                    Descargar PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <footer>© 2024 ULEAM Revistas. Todos los derechos reservados.</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRevistasStore } from '../../stores/revistas'
import AppHeader from '../../components/AppHeader.vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const revistasStore = useRevistasStore()

const revistasAprobadas = computed(() => {
  return revistasStore.getRevistasAprobadas()
})

const eliminarRevista = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta revista?')) {
    revistasStore.eliminarRevista(id)
    alert('Revista eliminada correctamente.')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

const descargarArchivo = (revista) => {
  // Si es un archivo base64, crear un enlace de descarga temporal
  if (revista.archivo && revista.archivo.startsWith('data:')) {
    const link = document.createElement('a')
    link.href = revista.archivo
    link.download = revista.archivoOriginal?.nombre || `${revista.titulo}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    // Para archivos predefinidos, usar descarga normal
    const link = document.createElement('a')
    link.href = revista.archivo
    link.download = `${revista.titulo}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<style scoped>
.admin-revistas {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.container {
  display: flex;
  min-height: calc(100vh - 130px);
}

main {
  flex: 1;
  padding: 20px;
}

.create-magazine-section {
  margin-bottom: 20px;
}

.btn {
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-success2 {
  background-color: #2850a7;
  color: white;
}

.btn-success2:hover {
  background-color: #1e3d82;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.magazine-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.magazine-card {
  background-color: white;
  border: 1px solid #ddd;
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.magazine-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.magazine-card-body {
  padding: 15px;
}

.magazine-card-body h4 {
  margin-bottom: 10px;
  color: #333;
}

.magazine-card-body p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.magazine-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.date {
  font-size: 0.8rem;
  color: #6c757d;
}

.magazine-actions > div {
  display: flex;
  gap: 10px;
}

footer {
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 10px;
}
</style>
