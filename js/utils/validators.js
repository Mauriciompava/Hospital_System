/**
 * VALIDADORES DE FORMULARIOS
 * Validación de entrada de datos en el sistema
 * 
 * Este módulo proporciona validación para:
 * - Login y autenticación
 * - Registro de usuarios
 * - Creación de citas médicas
 * - Actualización de datos
 */

class Validator {
    /**
     * Valida campos requeridos
     * @param {object} data - Objeto con datos
     * @param {array} requiredFields - Array de nombres de campos requeridos
     * @returns {object} {valid: boolean, errors: []}
     * @example validate.validateRequired({name: 'Juan', email: ''}, ['name', 'email'])
     */
    static validateRequired(data, requiredFields) {
        const errors = [];
        requiredFields.forEach(field => {
            if (!data[field] || data[field].toString().trim() === '') {
                errors.push(`${field} es requerido`);
            }
        });
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida credenciales de login
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {object} {valid: boolean, errors: []}
     */
    static validateLogin(username, password) {
        const errors = [];
        if (!username || username.trim() === '') {
            errors.push('Usuario es requerido');
        }
        if (!password || password.trim() === '') {
            errors.push('Contraseña es requerida');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida datos de registro de usuario
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @param {string} name - Nombre completo
     * @param {string} email - Email
     * @returns {object} {valid: boolean, errors: []}
     */
    static validateRegistration(username, password, name, email) {
        const errors = [];

        if (!username || username.trim() === '') {
            errors.push('Usuario es requerido');
        } else if (username.length < 3) {
            errors.push('Usuario debe tener al menos 3 caracteres');
        }

        if (!password || password.trim() === '') {
            errors.push('Contraseña es requerida');
        } else if (password.length < 6) {
            errors.push('Contraseña debe tener al menos 6 caracteres');
        }

        if (!name || name.trim() === '') {
            errors.push('Nombre es requerido');
        }

        if (!email || email.trim() === '') {
            errors.push('Email es requerido');
        } else if (!isValidEmail(email)) {
            errors.push('Email inválido');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida datos de cita médica
     * @param {string} doctorId - ID del doctor
     * @param {string} date - Fecha en formato YYYY-MM-DD
     * @param {string} time - Hora en formato HH:MM
     * @returns {object} {valid: boolean, errors: []}
     */
    static validateAppointment(doctorId, date, time) {
        const errors = [];

        if (!doctorId || doctorId.trim() === '') {
            errors.push('Doctor es requerido');
        }

        if (!date || date.trim() === '') {
            errors.push('Fecha es requerida');
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                errors.push('Fecha no puede ser en el pasado');
            }
        }

        if (!time || time.trim() === '') {
            errors.push('Hora es requerida');
        }

        // Validar disponibilidad
        if (doctorId && date && time && appointmentService) {
            if (!appointmentService.isTimeSlotAvailable(doctorId, date, time)) {
                errors.push('Este horario no está disponible');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Muestra errores en un elemento HTML
     * @param {string} elementId - ID del contenedor para errores
     * @param {array} errors - Array de mensajes de error
     * @example validate.displayErrors('errorContainer', ['Campo requerido', 'Email inválido'])
     */
    static displayErrors(elementId, errors) {
        const container = document.getElementById(elementId);
        if (!container) return;

        if (errors.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        container.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong><i class="bi bi-exclamation-triangle"></i> Errores:</strong>
        <ul class="mb-0 mt-2">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    `;
        container.style.display = 'block';
    }

    /**
     * Limpia los mensajes de error
     * @param {string} elementId - ID del contenedor de errores
     */
    static clearErrors(elementId) {
        this.displayErrors(elementId, []);
    }

    /**
     * Valida una contraseña
     * @param {string} password - Contraseña a validar
     * @returns {object} {valid: boolean, strength: 'weak'|'medium'|'strong', errors: []}
     */
    static validatePassword(password) {
        const errors = [];
        let strength = 'weak';

        if (password.length < 6) {
            errors.push('Mínimo 6 caracteres');
        } else if (password.length >= 8) {
            strength = 'medium';
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Debe contener mayúsculas');
        } else if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
            strength = 'strong';
        }

        if (!/[0-9]/.test(password)) {
            errors.push('Debe contener números');
        }

        return {
            valid: errors.length === 0,
            strength,
            errors
        };
    }

    /**
     * Valida un nombre de usuario
     * @param {string} username - Usuario a validar
     * @returns {object} {valid: boolean, errors: []}
     */
    static validateUsername(username) {
        const errors = [];

        if (!username || username.length < 3) {
            errors.push('Usuario debe tener mínimo 3 caracteres');
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            errors.push('Usuario solo puede contener letras, números, guiones o guion bajo');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Alias para acceso global
const validate = Validator;

console.log('✓ Módulo validators.js cargado');
