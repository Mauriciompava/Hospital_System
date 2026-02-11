/**
 * SERVICIO DE DOCTORES
 * Gestiona disponibilidad y horarios de doctores
 */

class DoctorService {
  constructor() {
    this.doctoravailabilityKey = 'doctor_availability';
  }

  /**
   * Establece la disponibilidad de un doctor
   * @param {string} doctorId
   * @param {object} availability - {dayOfWeek: [startTime, endTime]}
   * @returns {object}
   */
  setAvailability(doctorId, availability) {
    const avail = {
      doctorId: doctorId,
      availability: availability, // { monday: ['09:00', '17:00'], ... }
      updatedAt: new Date().toISOString()
    };

    const existing = this.getAvailability(doctorId);
    if (existing) {
      return storage.updateInCollection(this.doctoravailabilityKey, existing.id, avail);
    } else {
      avail.id = this.generateId();
      storage.addToCollection(this.doctoravailabilityKey, avail);
      return avail;
    }
  }

  /**
   * Obtiene la disponibilidad de un doctor
   * @param {string} doctorId
   * @returns {object|null}
   */
  getAvailability(doctorId) {
    return storage.filterCollection(this.doctoravailabilityKey,
      a => a.doctorId === doctorId
    )[0] || null;
  }

  /**
   * Obtiene los doctores disponibles en una fecha
   * @param {string} date - formato YYYY-MM-DD
   * @returns {array}
   */
  getAvailableDoctors(date) {
    const doctors = userService.getUsersByRole('doctor');
    const dayName = this.getDayName(date);

    return doctors.filter(doctor => {
      const availability = this.getAvailability(doctor.id);
      return availability && availability.availability[dayName];
    });
  }

  /**
   * Obtiene los slots horarios disponibles de un doctor en una fecha
   * @param {string} doctorId
   * @param {string} date - formato YYYY-MM-DD
   * @returns {array} Array de horas disponibles
   */
  getAvailableTimeSlots(doctorId, date) {
    const availability = this.getAvailability(doctorId);
    if (!availability) return [];

    const dayName = this.getDayName(date);
    const dayAvail = availability.availability[dayName];

    if (!dayAvail || !dayAvail[0] || !dayAvail[1]) return [];

    const slots = [];
    const [startTime, endTime] = dayAvail;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    // Generar slots de 30 minutos
    let current = new Date();
    current.setHours(startHour, startMin, 0);
    const end = new Date();
    end.setHours(endHour, endMin, 0);

    while (current < end) {
      const time = this.formatTime(current);
      // Verificar si el slot está disponible
      if (appointmentService.isTimeSlotAvailable(doctorId, date, time)) {
        slots.push(time);
      }
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  }

  /**
   * Obtiene información de doctor con datos extendidos
   * @param {string} doctorId
   * @returns {object}
   */
  getDoctorWithDetails(doctorId) {
    const doctor = userService.getUserById(doctorId);
    if (!doctor) return null;

    const availability = this.getAvailability(doctorId);
    const appointments = appointmentService.getAppointmentsByDoctor(doctorId);

    return {
      ...doctor,
      availability: availability ? availability.availability : {},
      appointmentCount: appointments.length,
      completedCount: appointments.filter(a => a.status === 'completed').length
    };
  }

  /**
   * Obtiene el nombre del día de la semana
   * @param {string} date - formato YYYY-MM-DD
   * @returns {string}
   */
  getDayName(date) {
    const d = new Date(date);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[d.getDay()];
  }

  /**
   * Formatea la hora
   * @param {Date} date
   * @returns {string} HH:MM
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  generateId() {
    return `davail-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

const doctorService = new DoctorService();
