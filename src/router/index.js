import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Importar vistas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Registro from '../views/Registro.vue'
import Dashboard from '../views/Dashboard.vue'
import Revistas from '../views/Revistas.vue'
import SubirRevista from '../views/SubirRevista.vue'
import Perfil from '../views/Perfil.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminRevistas from '../views/admin/AdminRevistas.vue'
import AdminUsuarios from '../views/admin/AdminUsuarios.vue'
import CrearRevista from '../views/admin/CrearRevista.vue'
import CrearUsuario from '../views/admin/CrearUsuario.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/revistas',
    name: 'Revistas',
    component: Revistas,
    meta: { requiresAuth: true },
  },
  {
    path: '/subir-revista',
    name: 'SubirRevista',
    component: SubirRevista,
    meta: { requiresAuth: true },
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: Perfil,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/revistas',
    name: 'AdminRevistas',
    component: AdminRevistas,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/usuarios',
    name: 'AdminUsuarios',
    component: AdminUsuarios,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/crear-revista',
    name: 'CrearRevista',
    component: CrearRevista,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/crear-usuario',
    name: 'CrearUsuario',
    component: CrearUsuario,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
