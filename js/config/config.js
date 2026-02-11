/**
 * CONFIGURACIÓN DEL SISTEMA
 * Variables, constantes y configuración global del proyecto
 * 
 * Este archivo contiene:
 * - Constantes de la aplicación
 * - Mensajes del sistema
 * - Colores y estilos
 * - Días de la semana
 * - Referencia rápida de APIs
 */

// ============================================
// CONFIGURACIÓN GENERAL DEL SISTEMA
// ============================================

const CONFIG = {
    // Información de la aplicación
    APP_NAME: 'Sistema de Gestión Hospitalaria',
    APP_VERSION: '1.0',
    APP_DESCRIPTION: '100% Frontend - Sin Dependencias de Backend',
    APP_AUTHOR: 'Frontend Development Team',
    APP_YEAR: 2025,

    // Prefijos de almacenamiento en localStorage
    STORAGE_PREFIX: 'hospital_',
    SESSION_KEY: 'hospital_current_user',

    // Definición de roles
    ROLES: {
        ADMIN: 'admin',
        DOCTOR: 'doctor',
        PATIENT: 'patient'
    },

    // Estados posibles de cita
    APPOINTMENT_STATUS: {
        SCHEDULED: 'scheduled',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    },

    // Configuración de tiempo
    TIME_SLOT_DURATION: 30,      // Duración de slots horarios en minutos
    MAX_FUTURE_DAYS: 90,          // Máximo de días a futuro para agendar

    // Validaciones de formularios
    VALIDATION: {
        USERNAME_MIN_LENGTH: 3,
        PASSWORD_MIN_LENGTH: 6,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    // Configuración de UI
    UI: {
        MODAL_FADE_TIME: 300,
        FORM_MIN_SUBMIT_WAIT: 1000,
        NOTIFICATION_TIMEOUT: 3000
    }
};

// ============================================
// MENSAJES DEL SISTEMA
// ============================================

const MESSAGES = {
    SUCCESS: {
        LOGIN: '¡Bienvenido!',
        LOGOUT: 'Sesión cerrada correctamente',
        USER_CREATED: 'Usuario creado correctamente',
        USER_UPDATED: 'Usuario actualizado',
        USER_DELETED: 'Usuario eliminado',
        APPOINTMENT_CREATED: 'Cita agendada correctamente',
        APPOINTMENT_UPDATED: 'Cita actualizada',
        APPOINTMENT_COMPLETED: 'Cita marcada como completada',
        APPOINTMENT_CANCELLED: 'Cita cancelada',
        SCHEDULE_SAVED: 'Agenda actualizada correctamente',
        OPERATION_SUCCESS: 'Operación completada con éxito'
    },

    ERROR: {
        INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos',
        USER_EXISTS: 'El usuario ya existe',
        REQUIRED_FIELD: 'Este campo es requerido',
        INVALID_EMAIL: 'Email inválido',
        PASSWORD_TOO_SHORT: 'Contraseña debe tener al menos 6 caracteres',
        NO_AVAILABLE_SLOTS: 'No hay horarios disponibles',
        PAST_DATE: 'La fecha no puede ser en el pasado',
        NOT_AUTHENTICATED: 'No autenticado',
        FORBIDDEN: 'Acceso denegado',
        OPERATION_FAILED: 'Operación fallida',
        NETWORK_ERROR: 'Error de conexión'
    },

    INFO: {
        LOADING: 'Cargando...',
        NO_DATA: 'No hay datos para mostrar',
        CONFIRM_DELETE: '¿Está seguro que desea eliminar este elemento?',
        CONFIRM_CANCEL: '¿Está seguro que desea cancelar?'
    }
};

// ============================================
// COLORES Y TEMAS
// ============================================

const COLORS = {
    PRIMARY: '#0d6efd',
    SECONDARY: '#6c757d',
    SUCCESS: '#198754',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#0dcaf0',
    LIGHT: '#f8f9fa',
    DARK: '#212529',

    // Estados de cita con colores
    BADGE: {
        scheduled: 'bg-info',
        completed: 'bg-success',
        cancelled: 'bg-danger'
    },

    // Roles con colores
    ROLE_COLORS: {
        admin: '#FF9800',
        doctor: '#9C27B0',
        patient: '#00BCD4'
    }
};

// ============================================
// DÍAS DE LA SEMANA Y CALENDARIO
// ============================================

const DAYS_OF_WEEK = {
    sunday: 'Domingo',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado'
};

const DAYS_EN = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const MONTHS = {
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
};

// ============================================
// REFERENCIA RÁPIDA - SERVICIOS DISPONIBLES
// ============================================

/**
 * SERVICIOS DE ALMACENAMIENTO Y DATOS
 * 
 * StorageService → Métodos CRUD para localStorage
 *   - storage.getItem(key)
 *   - storage.setItem(key, value)
 *   - storage.getCollection(key)
 *   - storage.addToCollection(key, item)
 *   - storage.updateInCollection(key, id, updates)
 *   - storage.removeFromCollection(key, id)
 */

/**
 * SERVICIOS DE NEGOCIO
 * 
 * AuthService → Autenticación y sesiones
 *   - auth.login(username, password)
 *   - auth.logout()
 *   - auth.getCurrentUser()
 *   - auth.isAuthenticated()
 *   - auth.hasRole(role)
 *   - auth.register(userData)
 * 
 * UserService → Gestión de usuarios
 *   - userService.getAllUsers()
 *   - userService.getUserById(id)
 *   - userService.getUsersByRole(role)
 *   - userService.updateUser(id, updates)
 *   - userService.deleteUser(id)
 *   - userService.getUserStatistics()
 * 
 * AppointmentService → Gestión de citas
 *   - appointmentService.createAppointment(data)
 *   - appointmentService.getAppointmentsByPatient(patientId)
 *   - appointmentService.getAppointmentsByDoctor(doctorId)
 *   - appointmentService.cancelAppointment(appointmentId)
 *   - appointmentService.completeAppointment(appointmentId, notes)
 *   - appointmentService.isTimeSlotAvailable(doctorId, date, time)
 * 
 * DoctorService → Disponibilidad de doctores
 *   - doctorService.setAvailability(doctorId, availability)
 *   - doctorService.getAvailability(doctorId)
 *   - doctorService.getAvailableTimeSlots(doctorId, date)
 *   - doctorService.getAvailableDoctors(date)
 */

/**
 * CONTROLADORES
 * 
 * AuthController → Login y autenticación
 *   - AuthController.renderLoginView()
 *   - AuthController.handleLogin()
 *   - AuthController.renderDashboard()
 * 
 * AdminController → Panel administrador
 *   - AdminController.renderDashboard()
 *   - AdminController.renderUsersView()
 *   - AdminController.renderAppointmentsView()
 * 
 * DoctorController → Panel doctor
 *   - DoctorController.renderDashboard()
 *   - DoctorController.renderScheduleView()
 *   - DoctorController.renderAppointmentsView()
 * 
 * PatientController → Panel paciente
 *   - PatientController.renderDashboard()
 *   - PatientController.renderBookingView()
 *   - PatientController.renderMyAppointmentsView()
 */

/**
 * UTILIDADES Y HELPERS
 * 
 * showAlert(title, message, type)        → Mostrar alerta modal
 * formatDate(date)                       → YYYY-MM-DD
 * formatDateTime(date, time)             → Formato legible
 * getDayName(date)                       → Nombre del día
 * getStatusBadge(status)                 → Badge HTML
 * getDoctorName(doctorId)                → Nombre del doctor
 * getPatientName(patientId)              → Nombre del paciente
 * isValidEmail(email)                    → Validar email
 * handleLogout()                         → Cerrar sesión
 * clearForm(formId)                      → Limpiar formulario
 */

/**
 * VALIDADORES
 * 
 * validate.validateLogin(username, password)
 * validate.validateRegistration(username, password, name, email)
 * validate.validateAppointment(doctorId, date, time)
 * validate.validatePassword(password)
 * validate.validateUsername(username)
 * validate.displayErrors(elementId, errors)
 * validate.clearErrors(elementId)
 */

// ============================================
// DATOS DE PRUEBA POR DEFECTO
// ============================================

/**
 * USUARIOS INCLUIDOS
 * 
 * ADMIN
 *   Usuario: admin
 *   Contraseña: admin123
 *   Nombre: Administrador del Hospital
 * 
 * DOCTORES
 *   Usuario: doctor1 / Contraseña: doctor123
 *   Nombre: Dr. Carlos Rodríguez
 *   
 *   Usuario: doctor2 / Contraseña: doctor123
 *   Nombre: Dra. María García
 * 
 * PACIENTES
 *   Usuario: juan / Contraseña: patient123
 *   Nombre: Juan Pérez
 *   
 *   Usuario: ana / Contraseña: patient123
 *   Nombre: Ana López
 */

/**
 * DISPONIBILIDAD POR DEFECTO
 * 
 * Dr. Carlos Rodríguez (doctor1)
 *   Lunes-Martes, Jueves-Viernes: 09:00-17:00
 *   Miércoles: 10:00-16:00
 *   Fines de semana: No disponible
 * 
 * Dra. María García (doctor2)
 *   Lunes, Miércoles-Viernes: 10:00-18:00
 *   Sábados: 09:00-13:00
 *   Martes, Domingos: No disponible
 */

// ============================================
// INFORMACIÓN DEL SISTEMA
// ============================================

console.log(`
╔════════════════════════════════════════════╗
║  ${CONFIG.APP_NAME}        ║
║  v${CONFIG.APP_VERSION} - Frontend 100%                ║
║  2025                              ║
╚════════════════════════════════════════════╝
`);

console.log('✓ Configuración del sistema cargada');
console.log(`ℹ️  API Reference: Consulta js/config/config.js para ejemplos de API`);
