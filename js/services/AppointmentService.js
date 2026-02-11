/**
 * SERVICIO DE CITAS MÉDICAS
 * Gestiona CRUD de citas y su estado
 */

class AppointmentService {
  constructor() {
    this.appointmentsKey = 'appointments';
  }

  /**
   * Crea una nueva cita
   * @param {object} data - {patientId, doctorId, date, time, reason}
   * @returns {object} Cita creada
   */
  createAppointment(data) {
    const now = new Date().toISOString();
    const appointment = {
      id: this.generateId(),
      patientId: data.patientId,
      doctorId: data.doctorId,
      date: data.date,
      time: data.time,
      reason: data.reason || '',
      status: 'scheduled', // scheduled, completed, cancelled
      notes: '',
      createdAt: now,
      updatedAt: now,
      history: [
        {
          timestamp: now,
          action: 'created',
          status: 'scheduled',
          details: `Cita creada para el ${data.date} a las ${data.time}`
        }
      ]
    };

    storage.addToCollection(this.appointmentsKey, appointment);
    console.log(`✓ Cita creada: ${appointment.id}`);
    return appointment;
  }

  /**
   * Obtiene todas las citas
   * @returns {array}
   */
  getAllAppointments() {
    return storage.getCollection(this.appointmentsKey);
  }

  /**
   * Obtiene una cita por ID
   * @param {string} appointmentId
   * @returns {object|null}
   */
  getAppointmentById(appointmentId) {
    return storage.findInCollection(this.appointmentsKey, appointmentId);
  }

  /**
   * Obtiene citas de un paciente
   * @param {string} patientId
   * @returns {array}
   */
  getAppointmentsByPatient(patientId) {
    return storage.filterCollection(this.appointmentsKey, 
      apt => apt.patientId === patientId
    );
  }

  /**
   * Obtiene citas de un doctor
   * @param {string} doctorId
   * @returns {array}
   */
  getAppointmentsByDoctor(doctorId) {
    return storage.filterCollection(this.appointmentsKey,
      apt => apt.doctorId === doctorId
    );
  }

  /**
   * Obtiene citas por estado
   * @param {string} status - scheduled, completed, cancelled
   * @returns {array}
   */
  getAppointmentsByStatus(status) {
    return storage.filterCollection(this.appointmentsKey,
      apt => apt.status === status
    );
  }

  /**
   * Actualiza una cita
   * @param {string} appointmentId
   * @param {object} updates
   * @param {string} action - tipo de acción (modified, completed, cancelled)
   * @returns {object|null}
   */
  updateAppointment(appointmentId, updates, action = 'modified') {
    const appointment = this.getAppointmentById(appointmentId);
    if (!appointment) return null;

    updates.updatedAt = new Date().toISOString();
    
    // Agregar evento al historial
    const historyEvent = {
      timestamp: updates.updatedAt,
      action: action,
      status: updates.status || appointment.status,
      details: this.getActionDetails(action, appointment, updates)
    };
    
    if (!appointment.history) {
      appointment.history = [];
    }
    updates.history = [...appointment.history, historyEvent];
    
    return storage.updateInCollection(this.appointmentsKey, appointmentId, updates);
  }

  /**
   * Cancela una cita
   * @param {string} appointmentId
   * @returns {object|null}
   */
  cancelAppointment(appointmentId) {
    return this.updateAppointment(appointmentId, { status: 'cancelled' }, 'cancelled');
  }

  /**
   * Marca una cita como completada
   * @param {string} appointmentId
   * @param {string} notes
   * @returns {object|null}
   */
  completeAppointment(appointmentId, notes = '') {
    return this.updateAppointment(appointmentId, { 
      status: 'completed',
      notes: notes
    }, 'completed');
  }

  /**
   * Elimina una cita
   * @param {string} appointmentId
   * @returns {boolean}
   */
  deleteAppointment(appointmentId) {
    return storage.removeFromCollection(this.appointmentsKey, appointmentId);
  }

  /**
   * Obtiene citas de un doctor en una fecha específica
   * @param {string} doctorId
   * @param {string} date - formato YYYY-MM-DD
   * @returns {array}
   */
  getAppointmentsByDoctorAndDate(doctorId, date) {
    return storage.filterCollection(this.appointmentsKey,
      apt => apt.doctorId === doctorId && apt.date === date
    );
  }

  /**
   * Verifica disponibilidad de un slot horario
   * @param {string} doctorId
   * @param {string} date
   * @param {string} time
   * @returns {boolean}
   */
  isTimeSlotAvailable(doctorId, date, time) {
    const appointments = this.getAppointmentsByDoctorAndDate(doctorId, date);
    return !appointments.some(apt => apt.time === time && apt.status !== 'cancelled');
  }

  /**
   * Obtiene estadísticas de citas
   * @returns {object}
   */
  getAppointmentStatistics() {
    const appointments = this.getAllAppointments();
    return {
      total: appointments.length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length
    };
  }

  /**
   * Obtiene detalles de la acción para el historial
   * @param {string} action
   * @param {object} appointment
   * @param {object} updates
   * @returns {string}
   */
  getActionDetails(action, appointment, updates) {
    const actionTexts = {
      'created': `Cita creada para ${appointment.date} a las ${appointment.time}`,
      'modified': `Cita modificada de ${appointment.date} ${appointment.time}`,
      'completed': `Cita completada${updates.notes ? ': ' + updates.notes : ''}`,
      'cancelled': 'Cita cancelada'
    };
    return actionTexts[action] || 'Cita actualizada';
  }

  /**
   * Obtiene historial de una cita
   * @param {string} appointmentId
   * @returns {array}
   */
  getAppointmentHistory(appointmentId) {
    const appointment = this.getAppointmentById(appointmentId);
    return appointment && appointment.history ? appointment.history : [];
  }

  generateId() {
    return `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

const appointmentService = new AppointmentService();
