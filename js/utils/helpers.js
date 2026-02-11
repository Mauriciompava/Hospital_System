/**
 * UTILIDADES Y HELPERS
 * Funciones auxiliares generales del sistema
 * 
 * Este módulo proporciona funciones reutilizables para:
 * - Formateo de fechas y horas
 * - Manejo de alertas visuales
 * - Obtención de nombres de usuarios
 * - Manejo de eventos globales
 */

/**
 * Muestra una alerta con modal Bootstrap
 * @param {string} title - Título de la alerta
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'info', 'warning'
 * @example showAlert('Éxito', 'Cita agendada', 'success')
 */
function showAlert(title, message, type = 'info') {
    const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    const titleEl = document.getElementById('alertTitle');
    const messageEl = document.getElementById('alertMessage');

    titleEl.textContent = title;
    messageEl.innerHTML = message; // innerHTML para permitir HTML en el mensaje

    // Cambiar color según tipo
    const colors = {
        success: 'text-success',
        error: 'text-danger',
        warning: 'text-warning',
        info: 'text-info'
    };

    titleEl.className = colors[type] || colors.info;
    alertModal.show();
}

/**
 * Formatea una fecha a YYYY-MM-DD
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 * @example formatDate(new Date()) → "2025-02-10"
 */
function formatDate(date) {
    if (typeof date === 'string') {
        return date;
    }
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * Formatea una hora a HH:MM
 * @param {string|Date} time - Hora a formatear
 * @returns {string} Hora en formato HH:MM
 * @example formatTime(new Date()) → "14:30"
 */
function formatTime(time) {
    if (typeof time === 'string') return time;
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Formatea fecha y hora para mostrar en texto legible
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {string} time - Hora en formato HH:MM
 * @returns {string} Texto formateado: "10 de Febrero de 2025 a las 14:30"
 * @example formatDateTime('2025-02-10', '14:30') → "10 de Febrero de 2025 a las 14:30"
 */
function formatDateTime(date, time) {
    const dateObj = new Date(date);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const month = monthNames[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    return `${day} de ${month} de ${year} a las ${time}`;
}

/**
 * Obtiene el nombre del día de la semana en español
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @returns {string} Nombre del día: "Lunes", "Martes", etc.
 * @example getDayName('2025-02-10') → "Lunes"
 */
function getDayName(date) {
    const dateObj = new Date(date);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dateObj.getDay()];
}

/**
 * Obtiene el badge HTML de estado de cita con estilo Bootstrap
 * @param {string} status - Estado: 'scheduled', 'completed', 'cancelled'
 * @returns {string} HTML del badge con color según estado
 * @example getStatusBadge('completed') → '<span class="badge bg-success">Completada</span>'
 */
function getStatusBadge(status) {
    const badges = {
        scheduled: '<span class="badge bg-info">Programada</span>',
        completed: '<span class="badge bg-success">Completada</span>',
        cancelled: '<span class="badge bg-danger">Cancelada</span>'
    };
    return badges[status] || badges.scheduled;
}

/**
 * Obtiene el nombre del rol en español
 * @param {string} role - Rol: 'admin', 'doctor', 'patient'
 * @returns {string} Nombre del rol: "Administrador", "Doctor", "Paciente"
 * @example getRoleName('doctor') → "Doctor"
 */
function getRoleName(role) {
    const roles = {
        admin: 'Administrador',
        doctor: 'Doctor',
        patient: 'Paciente'
    };
    return roles[role] || role;
}

/**
 * Valida si un email tiene formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido, false en otro caso
 * @example isValidEmail('user@example.com') → true
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Función debounce para evitar múltiples llamadas rápidas
 * @param {function} func - Función a ejecutar
 * @param {number} wait - Milisegundos de espera
 * @returns {function} Función debounceada
 * @example const debouncedSearch = debounce(search, 500)
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Maneja el logout del usuario
 * Limpia sesión y redirecciona a login
 */
function handleLogout() {
    if (auth && typeof auth.logout === 'function') {
        auth.logout();
    }
    location.reload();
}

/**
 * Limpia un formulario por su ID
 * @param {string} formId - ID del formulario
 * @example clearForm('myForm')
 */
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Deshabilita un botón temporarily
 * @param {string} buttonId - ID del botón
 * @param {number} duration - Duración en ms de deshabilitación
 * @example disableButtonTemporarily('submitBtn', 2000)
 */
function disableButtonTemporarily(buttonId, duration = 2000) {
    const btn = document.getElementById(buttonId);
    if (btn) {
        btn.disabled = true;
        setTimeout(() => {
            btn.disabled = false;
        }, duration);
    }
}

/**
 * Obtiene el nombre del doctor por ID
 * @param {string} doctorId - ID del doctor
 * @returns {string} Nombre del doctor o "Doctor desconocido"
 */
function getDoctorName(doctorId) {
    if (!userService) return 'Doctor desconocido';
    const doctor = userService.getUserById(doctorId);
    return doctor ? doctor.name : 'Doctor desconocido';
}

/**
 * Obtiene el nombre del paciente por ID
 * @param {string} patientId - ID del paciente
 * @returns {string} Nombre del paciente o "Paciente desconocido"
 */
function getPatientName(patientId) {
    if (!userService) return 'Paciente desconocido';
    const patient = userService.getUserById(patientId);
    return patient ? patient.name : 'Paciente desconocido';
}

console.log('✓ Módulo helpers.js cargado');
