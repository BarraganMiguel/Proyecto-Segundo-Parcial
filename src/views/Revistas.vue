<template>
  <div class="revistas-page">
    <AppHeader />
    <AppNavigation />

    <main>
      <section class="section">
        <div class="section-header">
          <h3>Revistas Disponibles</h3>
        </div>
        <div class="revistas-grid">
          <div v-for="revista in revistasAprobadas" :key="revista.id" class="revista-card">
            <img :src="revista.portada" :alt="revista.titulo" />
            <h4>{{ revista.titulo }}</h4>
            <p><strong>Autores:</strong> {{ revista.autores }}</p>
            <p class="resumen">{{ revista.resumen }}</p>
            <a
              :href="revista.archivo"
              class="upload-btn"
              :download="revista.archivoOriginal?.nombre || `${revista.titulo}.pdf`"
              @click="descargarArchivo(revista)"
            >
              <i class="fas fa-file-download"></i> Descargar PDF
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRevistasStore } from '../stores/revistas'
import AppHeader from '../components/AppHeader.vue'
import AppNavigation from '../components/AppNavigation.vue'

const revistasStore = useRevistasStore()

const revistasAprobadas = computed(() => {
  return revistasStore.getRevistasAprobadas()
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
.revistas-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-attachment: fixed;
}

main {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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

.revistas-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.revista-card {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  padding: 15px;
  transition: box-shadow 0.3s ease;
}

.revista-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.revista-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.revista-card h4 {
  margin: 10px 0 5px;
  font-size: 1.1rem;
  color: #0056b3;
}

.revista-card p {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 10px;
}

.revista-card .resumen {
  margin: 10px 0;
  line-height: 1.5;
}

.upload-btn {
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  font-size: 0.95rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  text-align: center;
  margin-top: 10px;
  text-decoration: none;
}

.upload-btn:hover {
  background-color: #218838;
}

.upload-btn i {
  margin-right: 8px;
}

footer {
  text-align: center;
  padding: 15px;
  background-color: #333;
  color: white;
  margin-top: auto;
}
</style>
