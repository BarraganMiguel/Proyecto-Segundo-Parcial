<template>
  <div class="admin-usuarios">
    <AppHeader title="Revistas ULEAM - Administración" />

    <div class="container">
      <AdminSidebar />

      <main>
        <div class="create-magazine-section">
          <router-link to="/admin/crear-usuario" class="btn btn-success">
            <i class="fas fa-plus"></i> Crear Usuario
          </router-link>
        </div>

        <!-- ✅ USUARIOS PENDIENTES DE APROBACIÓN -->
        <div v-if="usuariosPendientes.length > 0" class="card">
          <div class="card-header">
            <h3>
              <i class="fas fa-clock"></i> Usuarios Pendientes de Aprobación ({{
                usuariosPendientes.length
              }})
            </h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha Registro</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="usuario in usuariosPendientes" :key="usuario.id">
                    <td>
                      <div class="user-info">
                        <img src="/AvatarUsuario.png" alt="Avatar" class="user-avatar-small" />
                        <span>{{ usuario.nombre }} {{ usuario.apellido }}</span>
                      </div>
                    </td>
                    <td>{{ usuario.email }}</td>
                    <td>
                      <span :class="['rol-badge', usuario.rol]">
                        {{ usuario.rol }}
                      </span>
                    </td>
                    <td>{{ formatDate(usuario.fechaRegistro) }}</td>
                    <td>
                      <span :class="['tipo-badge', usuario.tipoRegistro || 'sistema']">
                        {{ usuario.tipoRegistro === 'publico' ? 'Público' : 'Sistema' }}
                      </span>
                    </td>
                    <td>
                      <div class="actions">
                        <button
                          @click="aprobarUsuario(usuario.id)"
                          class="action-btn btn-approve"
                          title="Aprobar usuario"
                        >
                          <i class="fas fa-check"></i>
                        </button>
                        <button
                          @click="rechazarUsuario(usuario.id)"
                          class="action-btn btn-reject"
                          title="Rechazar usuario"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ✅ USUARIOS ACTIVOS -->
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-users"></i> Usuarios Activos ({{ usuariosActivos.length }})</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="usuario in usuariosActivos" :key="usuario.id">
                    <td>
                      <div class="user-info">
                        <img src="/AvatarUsuario.png" alt="Avatar" class="user-avatar-small" />
                        <span>{{ usuario.nombre }} {{ usuario.apellido }}</span>
                      </div>
                    </td>
                    <td>{{ usuario.email }}</td>
                    <td>
                      <span :class="['rol-badge', usuario.rol]">
                        {{ usuario.rol }}
                      </span>
                    </td>
                    <td>
                      <span class="status activo">Activo</span>
                    </td>
                    <td>
                      <span :class="['tipo-badge', usuario.tipoRegistro || 'sistema']">
                        {{ usuario.tipoRegistro === 'publico' ? 'Público' : 'Sistema' }}
                      </span>
                    </td>
                    <td>
                      <div class="actions">
                        <button
                          v-if="usuario.email !== 'admin@live.uleam.edu.ec'"
                          @click="eliminarUsuario(usuario.id)"
                          class="action-btn btn-delete"
                          title="Eliminar usuario"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                        <span v-else class="protected-badge" title="Usuario protegido del sistema">
                          <i class="fas fa-shield-alt"></i>
                        </span>
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

    <footer>© 2024 ULEAM Revistas. Todos los derechos reservados.</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUsuariosStore } from '../../stores/usuarios'
import AppHeader from '../../components/AppHeader.vue'
import AdminSidebar from '../../components/AdminSidebar.vue'

const usuariosStore = useUsuariosStore()

const usuariosPendientes = computed(() => {
  return usuariosStore.getUsuariosPendientes()
})

const usuariosActivos = computed(() => {
  return usuariosStore.getUsuariosActivos()
})

const aprobarUsuario = (id) => {
  if (confirm('¿Aprobar este usuario?')) {
    usuariosStore.aprobarUsuario(id)
    alert('✅ Usuario aprobado correctamente.')
  }
}

const rechazarUsuario = (id) => {
  if (confirm('¿Rechazar este usuario? Se eliminará permanentemente.')) {
    usuariosStore.rechazarUsuario(id)
    alert('❌ Usuario rechazado.')
  }
}

const eliminarUsuario = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
    usuariosStore.eliminarUsuario(id)
    alert('🗑️ Usuario eliminado correctamente.')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}
</script>

<style scoped>
.admin-usuarios {
  background-color: #f4f4f4;
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

.btn-success {
  background: #28a745;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;
}

.btn-success:hover {
  background: #218838;
}

.card {
  background: white;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  color: #333;
}

.card-header h3 i {
  margin-right: 10px;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar-small {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status.activo {
  background: #d4edda;
  color: #155724;
}

.status.pendiente {
  background: #fff3cd;
  color: #856404;
}

.rol-badge {
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
}

.rol-badge.administrador {
  background: #dc3545;
  color: white;
}

.rol-badge.usuario {
  background: #007bff;
  color: white;
}

.rol-badge.docente {
  background: #28a745;
  color: white;
}

.rol-badge.investigador {
  background: #6f42c1;
  color: white;
}

.tipo-badge {
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
}

.tipo-badge.publico {
  background: #17a2b8;
  color: white;
}

.tipo-badge.sistema {
  background: #6c757d;
  color: white;
}

.actions {
  display: flex;
  gap: 5px;
}

.action-btn {
  border: none;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 12px;
}

.btn-approve {
  background: #28a745;
  color: white;
}

.btn-approve:hover {
  background: #218838;
}

.btn-reject {
  background: #dc3545;
  color: white;
}

.btn-reject:hover {
  background: #c82333;
}

.btn-delete {
  background: #6c757d;
  color: white;
}

.btn-delete:hover {
  background: #5a6268;
}

.protected-badge {
  color: #ffc107;
  font-size: 16px;
  cursor: help;
}

footer {
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 10px;
}
</style>
