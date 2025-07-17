<template>
  <div class="admin-dashboard">
    <AppHeader title="Revistas ULEAM - Administración" />

    <div class="container">
      <AdminSidebar />

      <main>
        <div class="content-grid">
          <div class="card">
            <div class="card-header">
              <h3><i class="fas fa-tasks"></i> Revistas para publicar pendientes</h3>
            </div>
            <div class="card-body">
              <div class="reviews-list">
                <div v-for="revista in revistasPendientes" :key="revista.id" class="review-item">
                  <div :class="['review-status', revista.prioridad]">
                    <span>{{ revista.prioridad === 'urgente' ? 'Urgente' : 'Normal' }}</span>
                  </div>
                  <div class="review-content">
                    <h4>{{ revista.titulo }}</h4>
                    <p class="review-meta">
                      {{ revista.categoria }} • Enviado: {{ formatDate(revista.fecha) }}
                    </p>
                    <p class="review-author">Autor: {{ revista.autores }}</p>
                    <div class="review-actions">
                      <button @click="rechazarRevista(revista.id)" class="btn btn-danger">
                        No Aprobar
                      </button>
                      <button @click="aprobarRevista(revista.id)" class="btn btn-success">
                        Aprobar
                      </button>
                      <a href="#" class="btn btn-success2" @click="descargarArchivo(revista)">
                        Descargar PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-users"></i> Usuarios Recientes</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha de registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="usuario in usuariosRecientes" :key="usuario.id">
                    <td>
                      <div class="user-info">
                        <span>{{ usuario.nombre }} {{ usuario.apellido }}</span>
                      </div>
                    </td>
                    <td>{{ usuario.email }}</td>
                    <td>{{ usuario.rol }}</td>
                    <td>{{ formatDate(usuario.fechaRegistro) }}</td>
                    <td>
                      <div class="actions">
                        <button @click="eliminarUsuario(usuario.id)" class="action-btn">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <footer>
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí - Panel de Administración</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRevistasStore } from '../../stores/revistas'
import { useUsuariosStore } from '../../stores/usuarios'
import AppHeader from '../../components/AppHeader.vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const revistasStore = useRevistasStore()
const usuariosStore = useUsuariosStore()

const revistasPendientes = computed(() => {
  return revistasStore.getRevistasPendientes().map((revista) => ({
    ...revista,
    prioridad: revista.id === 3 ? 'urgente' : 'normal',
  }))
})

const usuariosRecientes = computed(() => {
  return usuariosStore.getUsuariosRecientes()
})

const aprobarRevista = (id) => {
  revistasStore.aprobarRevista(id)
  alert('Revista aprobada')
}

const rechazarRevista = (id) => {
  revistasStore.rechazarRevista(id)
  alert('Revista no aprobada')
}

const eliminarUsuario = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    usuariosStore.eliminarUsuario(id)
    alert('Usuario eliminado correctamente.')
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
.admin-dashboard {
  background-color: #f5f5f5;
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

.content-grid {
  margin-bottom: 20px;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  background-color: #f8f9fa;
}

.card-header h3 {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  margin: 0;
}

.card-header h3 i {
  margin-right: 10px;
}

.card-body {
  padding: 15px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-item {
  display: flex;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.review-status {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: white;
}

.review-status.urgente {
  background-color: #dc3545;
}

.review-status.normal {
  background-color: #ffc107;
  color: #333;
}

.review-content {
  flex: 1;
  padding: 15px;
}

.review-content h4 {
  font-size: 1rem;
  margin-bottom: 5px;
}

.review-meta,
.review-author {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.review-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
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

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background: #c82333;
}

footer {
  text-align: center;
  padding: 15px;
  background-color: #343a40;
  color: #fff;
}
</style>
