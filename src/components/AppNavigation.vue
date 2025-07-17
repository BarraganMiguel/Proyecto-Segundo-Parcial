<template>
  <nav class="main-nav">
    <ul>
      <li v-for="item in navigationItems" :key="item.path" :class="{ active: isActive(item.path) }">
        <router-link :to="item.path"> <i :class="item.icon"></i> {{ item.label }} </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const navigationItems = computed(() => {
  if (authStore.isAdmin) {
    return [
      { path: '/admin/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { path: '/admin/revistas', label: 'Revistas', icon: 'fas fa-book' },
      { path: '/admin/usuarios', label: 'Usuarios', icon: 'fas fa-users' },
    ]
  } else {
    return [
      { path: '/dashboard', label: 'Inicio', icon: 'fas fa-home' },
      { path: '/revistas', label: 'Revistas', icon: 'fas fa-book' },
      { path: '/subir-revista', label: 'Subir Revista', icon: 'fas fa-upload' },
    ]
  }
})

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.main-nav {
  background-color: white;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.main-nav ul {
  display: flex;
  justify-content: center;
}

.main-nav ul li a {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
}

.main-nav ul li a i {
  margin-right: 8px;
}

.main-nav ul li.active a {
  color: #0056b3;
  border-bottom: 2px solid #0056b3;
}

.main-nav ul li a:hover {
  color: #0056b3;
}
</style>
