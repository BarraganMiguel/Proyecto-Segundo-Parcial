import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRevistasStore = defineStore('revistas', () => {
  // Función para convertir archivo a base64
  const convertirArchivoABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Función para generar portada única basada en ID (mantener para casos sin portada)
  const generarPortadaUnica = (id) => {
    const portadas = [
      '/descarga.jpg',
      '/RevistaIngTecnologia.jpg',
      '/RevistaEducacion.jpg',
      '/RevistaModa.jpg',
      '/Revsita de Historia.jpg',
    ]
    const portadaIndex = (id - 1) % portadas.length
    return portadas[portadaIndex]
  }

  // Datos iniciales por defecto
  const revistasIniciales = [
    {
      id: 1,
      titulo: 'Revista de Ciencias Marinas',
      autores: 'Juan Pérez, Ana Torres',
      fecha: '2024-03-15',
      area: 'Ciencias Marinas',
      resumen:
        'In pharetra, lacus at suscipit fermentum, felis enim fringilla neque, vel venenatis magna ante nec arcu. Cras odio orci, tempus a tincidunt ac, bibendum sit amet justo.',
      palabrasClave: 'marina, ecosistemas, conservación',
      numeroPaginas: 45,
      portada: '/descarga.jpg',
      archivo: '/PDF REVISTAS/Revista de Ciencias Marinas.pdf',
      estado: 'aprobada',
      autorId: 1,
      autorNombre: 'Juan Pérez',
    },
    {
      id: 2,
      titulo: 'Revista de Ingeniería y Tecnología',
      autores: 'María Ruiz, Luis Bravo',
      fecha: '2024-12-15',
      area: 'Ingeniería',
      resumen:
        'Phasellus dignissim turpis nec euismod sollicitudin. Nulla ac placerat enim, vel porttitor est. Sed lacinia nunc lectus, eget volutpat felis consectetur at.',
      palabrasClave: 'tecnología, ingeniería, innovación',
      numeroPaginas: 38,
      portada: '/RevistaIngTecnologia.jpg',
      archivo: '/PDF REVISTAS/Revista de tecnologia.pdf',
      estado: 'aprobada',
      autorId: 2,
      autorNombre: 'María García',
    },
    {
      id: 3,
      titulo: 'Análisis de ecosistemas costeros en la región de Manabí',
      autores: 'Morales, E.',
      fecha: '2024-05-15',
      area: 'Ciencias Marinas',
      resumen: 'Estudio detallado de los ecosistemas costeros y su impacto ambiental.',
      palabrasClave: 'ecosistemas, costa, Manabí',
      numeroPaginas: 52,
      portada: '/descarga.jpg',
      archivo: '/PDF REVISTAS/Revista de Ciencias Marinas.pdf',
      estado: 'pendiente',
      autorId: 3,
      autorNombre: 'Carlos Ruiz',
    },
  ]

  // Función para cargar revistas desde localStorage
  const cargarRevistasDesdeStorage = () => {
    const revistasGuardadas = localStorage.getItem('revistas')
    if (revistasGuardadas) {
      return JSON.parse(revistasGuardadas)
    }
    return revistasIniciales
  }

  // Función para guardar revistas en localStorage
  const guardarRevistasEnStorage = (revistasData) => {
    localStorage.setItem('revistas', JSON.stringify(revistasData))
  }

  // Inicializar revistas desde localStorage o datos por defecto
  const revistas = ref(cargarRevistasDesdeStorage())

  const getRevistasAprobadas = () => {
    return revistas.value.filter((revista) => revista.estado === 'aprobada')
  }

  const getRevistasPendientes = () => {
    return revistas.value.filter((revista) => revista.estado === 'pendiente')
  }

  const getRevistasByUser = (userId) => {
    console.log('🔍 Buscando revistas para usuario ID:', userId)
    const userRevistas = revistas.value.filter((revista) => {
      console.log(
        `📖 Revista "${revista.titulo}" - autorId: ${revista.autorId}, estado: ${revista.estado}`,
      )
      return revista.autorId === userId
    })
    console.log('📚 Revistas encontradas:', userRevistas.length)
    return userRevistas
  }

  const addRevista = async (revistaData) => {
    const newId = Date.now()

    let archivoURL = null
    let portadaURL = null

    // ✅ MANEJAR ARCHIVO PDF REAL
    if (revistaData.archivo && revistaData.archivo instanceof File) {
      try {
        archivoURL = await convertirArchivoABase64(revistaData.archivo)
      } catch (error) {
        console.error('Error al procesar archivo PDF:', error)
        archivoURL = '/PDF REVISTAS/Revista de Ciencias Marinas.pdf' // Fallback
      }
    } else {
      // Fallback para archivos predefinidos
      archivoURL = '/PDF REVISTAS/Revista de Ciencias Marinas.pdf'
    }

    // ✅ MANEJAR PORTADA REAL
    if (revistaData.portada && revistaData.portada instanceof File) {
      try {
        portadaURL = await convertirArchivoABase64(revistaData.portada)
      } catch (error) {
        console.error('Error al procesar portada:', error)
        portadaURL = generarPortadaUnica(newId) // Fallback
      }
    } else {
      // Fallback para portadas predefinidas
      portadaURL = generarPortadaUnica(newId)
    }

    const newRevista = {
      id: newId,
      titulo: revistaData.titulo,
      autores: revistaData.autores,
      fecha: revistaData.fecha,
      area: revistaData.area,
      resumen: revistaData.resumen,
      palabrasClave: revistaData.palabrasClave,
      numeroPaginas: revistaData.numeroPaginas,
      portada: portadaURL,
      archivo: archivoURL,
      estado: revistaData.estado || 'pendiente',
      autorId: revistaData.autorId,
      autorNombre: revistaData.autorNombre,
      fechaCreacion: new Date().toISOString().split('T')[0],
      // ✅ GUARDAR INFORMACIÓN DEL ARCHIVO ORIGINAL
      archivoOriginal: revistaData.archivo
        ? {
            nombre: revistaData.archivo.name,
            tipo: revistaData.archivo.type,
            tamaño: revistaData.archivo.size,
          }
        : null,
    }

    console.log('✅ Agregando nueva revista:', {
      titulo: newRevista.titulo,
      autorId: newRevista.autorId,
      autorNombre: newRevista.autorNombre,
      estado: newRevista.estado,
      archivoTipo: newRevista.archivoOriginal?.tipo,
      archivoNombre: newRevista.archivoOriginal?.nombre,
    })

    revistas.value.push(newRevista)
    guardarRevistasEnStorage(revistas.value)
    return newRevista
  }

  const aprobarRevista = (id) => {
    const revista = revistas.value.find((r) => r.id === id)
    if (revista) {
      revista.estado = 'aprobada'
      console.log('✅ Revista aprobada:', revista.titulo)
      guardarRevistasEnStorage(revistas.value)
    }
  }

  const rechazarRevista = (id) => {
    const index = revistas.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      const revista = revistas.value[index]
      console.log('❌ Revista rechazada:', revista.titulo)
      revistas.value.splice(index, 1)
      guardarRevistasEnStorage(revistas.value)
    }
  }

  const eliminarRevista = (id) => {
    const index = revistas.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      const revista = revistas.value[index]
      console.log('🗑️ Revista eliminada:', revista.titulo)
      revistas.value.splice(index, 1)
      guardarRevistasEnStorage(revistas.value)
    }
  }

  return {
    revistas,
    getRevistasAprobadas,
    getRevistasPendientes,
    getRevistasByUser,
    addRevista,
    aprobarRevista,
    rechazarRevista,
    eliminarRevista,
  }
})
