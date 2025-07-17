<template>
  <div class="home">
    <AppHeader title="Gestión de Revistas Científicas" />

    <main>
      <section class="hero-banner">
        <div class="hero-content">
          <h2>Sistema de Gestión de Revistas Científicas</h2>
          <p>
            Plataforma integral para la gestión, publicación y difusión de la producción científica
            de la Universidad Laica Eloy Alfaro de Manabí
          </p>

          <div class="hero-buttons">
            <router-link to="/login" class="btn btn-primary">
              <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-bottom">
        <p>
          &copy; 2024 Universidad Laica Eloy Alfaro de Manabí - Sistema de Gestión de Revistas
          Científicas
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex; /* ✅ AGREGADO: Para que el hero-banner ocupe todo el espacio */
}

.hero-banner {
  /* ✅ CAMBIADO: De min-height con cálculo fijo a flex: 1 */
  flex: 1;
  width: 100%;
  background:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; /* ✅ AGREGADO: Para evitar repetición */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px; /* ✅ AUMENTADO: Más padding vertical */
}

.hero-content {
  max-width: 800px; /* ✅ AGREGADO: Limitar ancho del contenido */
  width: 100%;
}

.hero-content h2 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* ✅ AGREGADO: Sombra para mejor legibilidad */
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 25px;
  line-height: 1.6; /* ✅ AGREGADO: Mejor espaciado de líneas */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7); /* ✅ AGREGADO: Sombra para mejor legibilidad */
}

.hero-buttons .btn {
  font-size: 1.1rem;
  padding: 12px 24px;
  border-radius: 8px; /* ✅ AGREGADO: Bordes más redondeados */
  transition: all 0.3s ease; /* ✅ AGREGADO: Transición suave */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* ✅ AGREGADO: Sombra al botón */
}

.hero-buttons .btn:hover {
  transform: translateY(-2px); /* ✅ AGREGADO: Efecto hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.hero-buttons .btn i {
  margin-right: 8px;
}

footer {
  background: #343a40;
  color: #f8f9fa;
  text-align: center;
  padding: 15px;
  font-size: 0.9rem;
  margin-top: 0; /* ✅ CAMBIADO: Eliminar margin-top automático */
}

/* ✅ AGREGADO: Responsive design */
@media (max-width: 768px) {
  .hero-content h2 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .hero-buttons .btn {
    font-size: 1rem;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .hero-content h2 {
    font-size: 1.5rem;
  }

  .hero-content p {
    font-size: 0.9rem;
  }

  .hero-banner {
    padding: 20px 15px;
  }
}
</style>
