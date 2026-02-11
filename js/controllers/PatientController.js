/**
 * CONTROLADOR PARA PACIENTE
 * Gestiona citas y reservas
 */

class PatientController {
  /**
   * Renderiza el dashboard del paciente
   */
  static renderDashboard() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'patient') {
      AuthController.renderLoginView();
      return;
    }

    const appointments = appointmentService.getAppointmentsByPatient(user.id);
    const scheduled = appointments.filter(a => a.status === 'scheduled').length;
    const completed = appointments.filter(a => a.status === 'completed').length;

    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="row">
        <div class="col-md-8">
          <h2>Bienvenido, ${user.name}</h2>
          <p class="text-muted">Email: ${user.email}</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-info" onclick="PatientController.renderMedicalHistoryView()">
            <i class="bi bi-file-medical"></i> Mi Historia Clínica
          </button>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-4">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <h5 class="card-title">Citas Programadas</h5>
              <p class="card-text display-4">${scheduled}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-success">
            <div class="card-body">
              <h5 class="card-title">Citas Completadas</h5>
              <p class="card-text display-4">${completed}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-info">
            <div class="card-body">
              <h5 class="card-title">Total de Citas</h5>
              <p class="card-text display-4">${appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4>Mis Próximas Citas</h4>
        ${this.renderUpcomingAppointments(appointments)}
      </div>
    `;
  }

  /**
   * Renderiza citas próximas
   */
  static renderUpcomingAppointments(appointments) {
    const upcoming = appointments.filter(a => a.status === 'scheduled').slice(0, 5);
    
    if (upcoming.length === 0) {
      return '<p class="text-muted">No tiene citas programadas</p>';
    }

    return `
      <div class="list-group">
        ${upcoming.map(apt => `
          <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1">Doctor: ${getDoctorName(apt.doctorId)}</h6>
                <p class="mb-1"><strong>${formatDateTime(apt.date, apt.time)}</strong></p>
                <p class="mb-0"><small class="text-muted">Motivo: ${apt.reason}</small></p>
              </div>
              <button class="btn btn-sm btn-danger" onclick="PatientController.cancelAppointment('${apt.id}')">
                Cancelar
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Renderiza vista de reserva de cita
   */
  static renderBookingView() {
    const container = document.getElementById('app-container');

    container.innerHTML = `
      <h2>Agendar Nueva Cita</h2>
      <div class="row">
        <div class="col-md-6">
          <div id="bookingErrors"></div>
          <form id="bookingForm">
            <div class="mb-3">
              <label for="doctorSelect" class="form-label">Seleccionar Doctor</label>
              <select class="form-select" id="doctorSelect" required>
                <option value="">Seleccione un doctor</option>
                ${userService.getUsersByRole('doctor').map(doctor => `
                  <option value="${doctor.id}">${doctor.name}</option>
                `).join('')}
              </select>
            </div>

            <div class="mb-3">
              <label for="dateSelect" class="form-label">Fecha</label>
              <input type="date" class="form-control" id="dateSelect" required>
            </div>

            <div class="mb-3">
              <label for="timeSelect" class="form-label">Hora</label>
              <select class="form-select" id="timeSelect" required>
                <option value="">Seleccione una hora</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="reasonSelect" class="form-label">Motivo de la Consulta</label>
              <textarea class="form-control" id="reasonSelect" rows="3" required></textarea>
            </div>

            <button type="submit" class="btn btn-primary">Agendar Cita</button>
            <button type="button" class="btn btn-secondary" onclick="PatientController.renderDashboard()">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('doctorSelect').addEventListener('change', () => {
      PatientController.updateDateOptions();
    });

    document.getElementById('dateSelect').addEventListener('change', () => {
      PatientController.updateTimeOptions();
    });

    document.getElementById('bookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      PatientController.handleBooking();
    });

    // Set min date to today
    const today = formatDate(new Date());
    document.getElementById('dateSelect').setAttribute('min', today);
  }

  /**
   * Actualiza opciones de fecha
   */
  static updateDateOptions() {
    const doctorid = document.getElementById('doctorSelect').value;
    if (!doctorid) return;

    // Generar próximas 30 días
    const dateInput = document.getElementById('dateSelect');
    const today = new Date();
    const minDate = formatDate(today);
    dateInput.setAttribute('min', minDate);
  }

  /**
   * Actualiza opciones de horario
   */
  static updateTimeOptions() {
    const doctorId = document.getElementById('doctorSelect').value;
    const date = document.getElementById('dateSelect').value;
    const timeSelect = document.getElementById('timeSelect');

    if (!doctorId || !date) {
      timeSelect.innerHTML = '<option value="">Seleccione una hora</option>';
      return;
    }

    const slots = doctorService.getAvailableTimeSlots(doctorId, date);
    
    if (slots.length === 0) {
      timeSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
      return;
    }

    timeSelect.innerHTML = `
      <option value="">Seleccione una hora</option>
      ${slots.map(time => `<option value="${time}">${time}</option>`).join('')}
    `;
  }

  /**
   * Maneja la reserva de cita
   */
  static handleBooking() {
    const doctorId = document.getElementById('doctorSelect').value;
    const date = document.getElementById('dateSelect').value;
    const time = document.getElementById('timeSelect').value;
    const reason = document.getElementById('reasonSelect').value;

    const validation = validate.validateAppointment(doctorId, date, time);
    if (!validation.valid) {
      validate.displayErrors('bookingErrors', validation.errors);
      return;
    }

    const user = auth.getCurrentUser();
    const appointment = appointmentService.createAppointment({
      patientId: user.id,
      doctorId: doctorId,
      date: date,
      time: time,
      reason: reason
    });

    if (appointment) {
      showAlert(
        'Éxito',
        `Cita agendada para el ${formatDateTime(date, time)}`,
        'success'
      );
      setTimeout(() => PatientController.renderMyAppointmentsView(), 1000);
    }
  }

  /**
   * Renderiza vista de mis citas
   */
  static renderMyAppointmentsView() {
    const user = auth.getCurrentUser();
    const appointments = appointmentService.getAppointmentsByPatient(user.id);

    const container = document.getElementById('app-container');
    container.innerHTML = `
      <h2>Mis Citas Médicas</h2>
      
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" href="#scheduled" data-bs-toggle="tab">
            Programadas (${appointments.filter(a => a.status === 'scheduled').length})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#completed" data-bs-toggle="tab">
            Completadas (${appointments.filter(a => a.status === 'completed').length})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#cancelled" data-bs-toggle="tab">
            Canceladas (${appointments.filter(a => a.status === 'cancelled').length})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#historial" data-bs-toggle="tab">
            Historial Completo
          </a>
        </li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="scheduled">
          ${this.renderAppointmentsList(
            appointments.filter(a => a.status === 'scheduled')
          )}
        </div>
        <div class="tab-pane fade" id="completed">
          ${this.renderAppointmentsList(
            appointments.filter(a => a.status === 'completed')
          )}
        </div>
        <div class="tab-pane fade" id="cancelled">
          ${this.renderAppointmentsList(
            appointments.filter(a => a.status === 'cancelled')
          )}
        </div>
        <div class="tab-pane fade" id="historial">
          ${this.renderAppointmentsHistory(appointments)}
        </div>
      </div>
    `;
  }

  /**
   * Renderiza lista de citas
   */
  static renderAppointmentsList(appointments) {
    if (appointments.length === 0) {
      return '<p class="text-muted">No hay citas en esta categoría</p>';
    }

    return `
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(apt => `
              <tr>
                <td>${getDoctorName(apt.doctorId)}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td>${apt.reason}</td>
                <td>${getStatusBadge(apt.status)}</td>
                <td>
                  <button class="btn btn-sm btn-info" onclick="PatientController.viewAppointmentDetails('${apt.id}')">
                    <i class="bi bi-eye"></i> Detalles
                  </button>
                  ${apt.status === 'scheduled' ? `
                    <button class="btn btn-sm btn-danger" 
                            onclick="PatientController.cancelAppointment('${apt.id}')">
                      <i class="bi bi-x"></i> Cancelar
                    </button>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Renderiza historial completo de citas con cambios
   */
  static renderAppointmentsHistory(appointments) {
    if (appointments.length === 0) {
      return '<p class="text-muted">No hay citas para mostrar</p>';
    }

    // Ordenar por fecha de creación descendente
    const sortedAppointments = [...appointments].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return `
      <div class="timeline">
        ${sortedAppointments.map(apt => `
          <div class="timeline-item mb-4 p-3 border rounded bg-light">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 class="mb-1">
                  <strong>Doctor:</strong> ${getDoctorName(apt.doctorId)}
                </h6>
                <p class="mb-1">
                  <strong>Fecha programada:</strong> ${apt.date} a las ${apt.time}
                </p>
                <p class="mb-1">
                  <strong>Motivo:</strong> ${apt.reason}
                </p>
                <p class="mb-2">
                  <strong>Estado actual:</strong> ${getStatusBadge(apt.status)}
                </p>
              </div>
            </div>

            <!-- Historial de cambios -->
            <div class="ps-3 border-start border-primary">
              <p class="small text-muted mb-2"><strong>Historial de cambios:</strong></p>
              <ul class="small list-unstyled">
                ${apt.history && apt.history.length > 0 ? apt.history.map(event => `
                  <li class="mb-2">
                    <span class="badge bg-${this.getStatusColor(event.action)}">
                      ${this.getActionLabel(event.action)}
                    </span>
                    <small class="text-muted d-block">
                      ${new Date(event.timestamp).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                    <small>${event.details}</small>
                  </li>
                `).join('') : `
                  <li class="text-muted">Sin historial registrado</li>
                `}
              </ul>
            </div>

            ${apt.notes ? `
              <div class="mt-2 p-2 bg-white rounded">
                <small><strong>Notas del doctor:</strong></small>
                <p class="small mb-0">${apt.notes}</p>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Obtiene el color del badge según la acción
   */
  static getStatusColor(action) {
    const colors = {
      'created': 'info',
      'modified': 'warning',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return colors[action] || 'secondary';
  }

  /**
   * Obtiene la etiqueta de la acción
   */
  static getActionLabel(action) {
    const labels = {
      'created': 'Creada',
      'modified': 'Modificada',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return labels[action] || 'Actualizada';
  }

  /**
   * Ver detalles de una cita
   */
  static viewAppointmentDetails(appointmentId) {
    const apt = appointmentService.getAppointmentById(appointmentId);
    const doctor = userService.getUserById(apt.doctorId);
    
    let historyHTML = '<strong>Historial de cambios:</strong><br>';
    if (apt.history && apt.history.length > 0) {
      historyHTML += apt.history.map(event => 
        `• ${this.getActionLabel(event.action)} - ${event.details}<br>
        <small>${new Date(event.timestamp).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</small><br>`
      ).join('<br>');
    } else {
      historyHTML += 'Sin cambios registrados<br>';
    }

    showAlert(
      'Detalles de Cita',
      `<strong>Doctor:</strong> ${doctor.name}<br>
       <strong>Fecha:</strong> ${apt.date}<br>
       <strong>Hora:</strong> ${apt.time}<br>
       <strong>Motivo:</strong> ${apt.reason}<br>
       <strong>Estado:</strong> ${apt.status}<br><br>
       ${historyHTML}
       ${apt.notes ? `<br><strong>Notas:</strong> ${apt.notes}` : ''}`,
      'info'
    );
  }

  /**
   * Cancela una cita
   */
  static cancelAppointment(appointmentId) {
    if (confirm('¿Desea cancelar esta cita?')) {
      appointmentService.cancelAppointment(appointmentId);
      showAlert('Éxito', 'Cita cancelada', 'success');
      setTimeout(() => this.renderMyAppointmentsView(), 1000);
    }
  }

  /**
   * Renderiza la vista de historia clínica del paciente (SOLO LECTURA)
   */
  static renderMedicalHistoryView() {
    const user = auth.getCurrentUser();
    const history = medicalHistoryService.getOrCreateHistory(user.id);
    const medicalNotes = medicalHistoryService.getMedicalNotes(user.id);

    const container = document.getElementById('app-container');
    container.innerHTML = `
      <h2>Mi Historia Clínica</h2>
      
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle"></i> <strong>Información:</strong> Esta es tu historia clínica. Los datos mostrados aquí son agregados y administrados por tus doctores. 
        Para realizar cambios, contacta con tu médico.
      </div>
      
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" href="#general" data-bs-toggle="tab">
            Información General
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#notes" data-bs-toggle="tab">
            Notas de Doctores (${medicalNotes.length})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#allergies" data-bs-toggle="tab">
            Alergias (${history.allergies.length})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#diseases" data-bs-toggle="tab">
            Enfermedades Crónicas (${history.chronicDiseases.length})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#medications" data-bs-toggle="tab">
            Medicamentos (${history.medications.length})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#surgeries" data-bs-toggle="tab">
            Cirugías (${history.surgeries.length})
          </a>
        </li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="general">
          <div class="card">
            <div class="card-body">
              <p><strong>Nombre:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Última actualización:</strong> ${new Date(history.lastUpdated).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
              
              ${history.notes ? `
                <div class="card mt-3 bg-light">
                  <div class="card-header">
                    <h5>Notas Personales</h5>
                  </div>
                  <div class="card-body">
                    <p>${history.notes}</p>
                  </div>
                </div>
              ` : `
                <div class="alert alert-secondary mt-3" role="alert">
                  <p class="mb-0">No hay notas personales registradas aún.</p>
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="notes">
          <div class="card">
            <div class="card-body">
              ${medicalNotes.length === 0 ? `
                <p class="text-muted"><i class="bi bi-info-circle"></i> Sus doctores aún no han agregado notas a su historia clínica</p>
              ` : `
                <div class="accordion" id="doctorNotesAccordion">
                  ${medicalNotes.map((note, idx) => {
                    const doctor = userService.getUserById(note.doctorId);
                    const noteBg = {
                      'diagnóstico': 'danger',
                      'tratamiento': 'info',
                      'observación': 'secondary',
                      'seguimiento': 'warning'
                    }[note.type] || 'secondary';
                    
                    const typeLabel = {
                      'diagnóstico': 'Diagnóstico',
                      'tratamiento': 'Tratamiento',
                      'observación': 'Observación',
                      'seguimiento': 'Seguimiento'
                    }[note.type] || 'Nota';

                    return `
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button ${idx > 0 ? 'collapsed' : ''}" type="button" 
                                  data-bs-toggle="collapse" data-bs-target="#doctorNote${idx}">
                            <span class="badge bg-${noteBg} me-2">
                              ${typeLabel}
                            </span>
                            Dr/Dra. ${doctor.name} - ${new Date(note.createdAt).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}
                          </button>
                        </h2>
                        <div id="doctorNote${idx}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}">
                          <div class="accordion-body">
                            <p>${note.note}</p>
                            <small class="text-muted">
                              Registrado: ${new Date(note.createdAt).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                            </small>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="allergies">
          <div class="card">
            <div class="card-body">
              ${history.allergies.length > 0 ? `
                <h5>Mis Alergias</h5>
                <ul class="list-group">
                  ${history.allergies.map(allergy => `
                    <li class="list-group-item">
                      <i class="bi bi-exclamation-triangle text-warning"></i> ${allergy}
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted"><i class="bi bi-check-circle"></i> No tiene alergias registradas</p>
              `}
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="diseases">
          <div class="card">
            <div class="card-body">
              ${history.chronicDiseases.length > 0 ? `
                <h5>Mis Enfermedades Crónicas</h5>
                <ul class="list-group">
                  ${history.chronicDiseases.map(disease => `
                    <li class="list-group-item">
                      <i class="bi bi-heart-pulse text-danger"></i> ${disease}
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted"><i class="bi bi-check-circle"></i> No tiene enfermedades crónicas registradas</p>
              `}
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="medications">
          <div class="card">
            <div class="card-body">
              ${history.medications.length > 0 ? `
                <h5>Medicamentos Actuales</h5>
                <ul class="list-group">
                  ${history.medications.map(medication => `
                    <li class="list-group-item">
                      <i class="bi bi-prescription2 text-info"></i> ${medication}
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted"><i class="bi bi-check-circle"></i> No tiene medicamentos registrados actualmente</p>
              `}
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="surgeries">
          <div class="card">
            <div class="card-body">
              ${history.surgeries.length > 0 ? `
                <h5>Historial de Cirugías</h5>
                <ul class="list-group">
                  ${history.surgeries.map(surgery => `
                    <li class="list-group-item">
                      <i class="bi bi-hospital text-primary"></i> ${surgery}
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted"><i class="bi bi-check-circle"></i> No tiene cirugías registradas</p>
              `}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <button class="btn btn-secondary" onclick="PatientController.renderDashboard()">
          Volver al Dashboard
        </button>
      </div>
    `;
  }

  /**
   * Guarda notas personales del paciente (OBSOLETO - No se usa más)
   */
  static savePersonalNotes() {
    showAlert('Info', 'Las notas personales solo pueden ser modificadas por tu doctor', 'info');
  }
}
