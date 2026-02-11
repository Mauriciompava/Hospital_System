/**
 * INICIALIZADOR DE DATOS
 * Carga datos por defecto en localStorage si no existen
 */

function initializeData() {
  console.log('🔄 Inicializando datos...');

  // Inicializar usuarios
  if (!storage.getItem('users')) {
    storage.setCollection('users', DEFAULT_USERS);
    console.log('✓ Usuarios inicializados');
  }

  // Inicializar disponibilidad de doctores
  if (!storage.getItem('doctor_availability')) {
    storage.setCollection('doctor_availability', DEFAULT_DOCTOR_AVAILABILITY);
    console.log('✓ Disponibilidad de doctores inicializada');
  }

  // Inicializar citas
  if (!storage.getItem('appointments')) {
    storage.setCollection('appointments', DEFAULT_APPOINTMENTS);
    console.log('✓ Citas inicializadas');
  }

  console.log('✓ Sistema listo');
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', initializeData);
