<template>
  <div class="perfil-page">
    <AppHeader />
    <AppNavigation />
    
    <main>
      <section class="profile-section">
        <h2>Mi Perfil</h2>
        <form class="profile-form">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              :value="authStore.user?.nombre" 
              disabled
            />
          </div>
          
          <div class="form-group">
            <label for="apellido">Apellido:</label>
            <input 
              type="text" 
              id="apellido" 
              :value="authStore.user?.apellido" 
              disabled
            />
          </div>
          
          <div class="form-group">
            <label for="correo">Correo Institucional:</label>
            <input 
              type="email" 
              id="correo" 
              :value="authStore.user?.email" 
              disabled
            />
          </div>
          
          <div class="form-group">
            <label for="rol">Rol:</label>
            <input 
              type="text" 
              id="rol" 
              :value="authStore.user?.rol" 
              disabled
            />
          </div>
          
          <div class="form-group">
            <label for="contrasena">Contraseña:</label>
            <input 
              type="password" 
              id="contrasena" 
              value="********" 
              disabled
            />
          </div>
          
          <div class="form-actions">
            <router-link to="/dashboard" class="btn btn-primary">
              Volver
            </router-link>
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
import { useAuthStore } from '../stores/auth'
import AppHeader from '../components/AppHeader.vue'
import AppNavigation from '../components/AppNavigation.vue'

const authStore = useAuthStore()
</script>

<style scoped>
.perfil-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

main {
  flex: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-section {
  min-width: 600px;
  width: 100%;
  margin: 50px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.profile-section h2 {
  margin-bottom: 20px;
  color: #0056b3;
}

.profile-form .form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.profile-form input:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
}

footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 15px;
}
</style>
