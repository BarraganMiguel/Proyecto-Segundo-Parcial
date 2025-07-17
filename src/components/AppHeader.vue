<template>
  <header class="app-header">
    <div class="logo">
      <img src="/Logo Uleam.jpg" alt="Logo ULEAM" />
      <h1>{{ title }}</h1>
    </div>

    <div v-if="authStore.isAuthenticated" class="user-menu" @click="toggleDropdown">
      <img src="/AvatarUsuario.png" alt="Avatar" class="user-avatar" />
      <span>{{ authStore.user?.nombre || 'Usuario' }}</span>
      <i class="fas fa-chevron-down"></i>

      <div v-if="showDropdown" class="dropdown-menu">
        <router-link v-if="!authStore.isAdmin" to="/perfil" class="dropdown-item">
          <i class="fas fa-user"></i> Mi Perfil
        </router-link>
        <a href="#" @click="logout" class="dropdown-item">
          <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
        </a>
      </div>
    </div>

    <div v-else class="user-info">
      <router-link to="/registro" class="register-btn">
        <i class="fas fa-user-plus"></i> Registrarse
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  title: {
    type: String,
    default: 'Revistas ULEAM',
  },
})

const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

// Cerrar dropdown al hacer click fuera
const closeDropdown = (e) => {
  if (!e.target.closest('.user-menu')) {
    showDropdown.value = false
  }
}

document.addEventListener('click', closeDropdown)

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.app-header {
  background-color: white;
  border-bottom: 3px solid #ddd;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  margin-right: 10px;
}

.logo h1 {
  font-size: 1.4rem;
  color: #0056b3;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item i {
  margin-right: 10px;
}

.register-btn {
  padding: 8px 15px;
  border: 1px solid #0056b3;
  background: transparent;
  color: #0056b3;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.register-btn:hover {
  background: #0056b3;
  color: white;
}

.register-btn i {
  margin-right: 6px;
}
</style>
