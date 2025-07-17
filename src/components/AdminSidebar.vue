<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in sidebarItems" :key="item.path" :class="{ active: isActive(item.path) }">
          <router-link :to="item.path"> <i :class="item.icon"></i> {{ item.label }} </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const sidebarItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { path: '/admin/revistas', label: 'Revistas', icon: 'fas fa-book' },
  { path: '/admin/usuarios', label: 'Usuarios', icon: 'fas fa-users' },
]

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #36383a;
  color: #fff;
  min-height: calc(100vh - 130px);
}

.sidebar-nav ul li a {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #adb5bd;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.sidebar-nav ul li a i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.sidebar-nav ul li a:hover {
  background-color: #495057;
  color: #fff;
}

.sidebar-nav ul li.active a {
  background-color: #0056b3;
  color: #fff;
}
</style>
