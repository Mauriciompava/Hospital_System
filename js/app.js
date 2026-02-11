/**
 * APLICACIÓN PRINCIPAL
 * Punto de entrada y coordinador general
 */

class HospitalApp {
    constructor() {
        this.initialized = false;
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        console.log('🏥 Inicializando Sistema de Gestión Hospitalaria...');

        // Esperar a que el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✓ DOM cargado');
            this.initialized = true;
        });
    }
}

// Crear instancia de la app
const app = new HospitalApp();
app.init();

// Log de información del sistema
console.log('📋 Sistema de Gestión Hospitalaria v1.0');
console.log('🔐 Autenticación con sessionStorage');
console.log('💾 Persistencia con localStorage');
console.log('🎨 Interfaz con Bootstrap 5');
