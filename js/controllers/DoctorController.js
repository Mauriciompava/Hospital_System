/**
 * CONTROLADOR PARA DOCTOR
 * Gestiona agenda, citas y disponibilidad
 */

class DoctorController {
  /**
   * Renderiza el dashboard del doctor
   */
  static renderDashboard() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'doctor') {
      AuthController.renderLoginView();
      return;
    }

    const appointments = appointmentService.getAppointmentsByDoctor(user.id);
    const scheduled = appointments.filter(a => a.status === 'scheduled').length;
    const completed = appointments.filter(a => a.status === 'completed').length;

    const container = document.getElementById('app-container');
    container.innerHTML = `
      <h2>Dashboard - Dr/Dra. ${user.name}</h2>
      
      <div class="row">
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
        <h4>Próximas Citas</h4>
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
      return '<p class="text-muted">No hay citas programadas</p>';
    }

    return `
      <div class="list-group">
        ${upcoming.map(apt => `
          <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1">Paciente: ${getPatientName(apt.patientId)}</h6>
                <p class="mb-1"><small>${apt.date} a las ${apt.time}</small></p>
                <p class="mb-0"><small class="text-muted">Motivo: ${apt.reason}</small></p>
              </div>
              <button class="btn btn-sm btn-success" onclick="DoctorController.completeAppointment('${apt.id}')">
                Completar
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Renderiza vista de agenda/disponibilidad
   */
  static renderScheduleView() {
    const user = auth.getCurrentUser();
    const availability = doctorService.getAvailability(user.id) || { 
      availability: {
        monday: ['09:00', '17:00'],
        tuesday: ['09:00', '17:00'],
        wednesday: ['09:00', '17:00'],
        thursday: ['09:00', '17:00'],
        friday: ['09:00', '17:00'],
        saturday: [],
        sunday: []
      }
    };

    const container = document.getElementById('app-container');
    const avail = availability.availability;

    container.innerHTML = `
      <h2>Mi Agenda</h2>
      <form id="scheduleForm">
        <div id="scheduleErrors"></div>
        
        <div class="row">
          <div class="col-md-6">
            <h5>Horario de Atención</h5>
            
            ${['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
              const dayLabel = {'monday':'Lunes','tuesday':'Martes','wednesday':'Miércoles',
                               'thursday':'Jueves','friday':'Viernes','saturday':'Sábado','sunday':'Domingo'}[day];
              const times = avail[day];
              const start = times[0] || '';
              const end = times[1] || '';
              
              return `
                <div class="mb-3 border-bottom pb-3">
                  <div class="row align-items-center">
                    <div class="col-md-4">
                      <label class="form-label"><strong>${dayLabel}</strong></label>
                    </div>
                    <div class="col-md-4">
                      <input type="time" class="form-control form-control-sm" 
                             id="start_${day}" value="${start}" 
                             placeholder="Inicio">
                    </div>
                    <div class="col-md-4">
                      <input type="time" class="form-control form-control-sm" 
                             id="end_${day}" value="${end}" 
                             placeholder="Fin">
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <button type="submit" class="btn btn-primary mt-3">Guardar Agenda</button>
      </form>
    `;

    document.getElementById('scheduleForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveSchedule();
    });
  }

  /**
   * Guarda la agenda del doctor
   */
  static handleSaveSchedule() {
    const user = auth.getCurrentUser();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availability = {};

    days.forEach(day => {
      const start = document.getElementById(`start_${day}`).value;
      const end = document.getElementById(`end_${day}`).value;
      availability[day] = (start && end) ? [start, end] : [];
    });

    doctorService.setAvailability(user.id, availability);
    showAlert('Éxito', 'Agenda actualizada correctamente', 'success');
    setTimeout(() => this.renderScheduleView(), 1000);
  }

  /**
   * Renderiza vista de citas del doctor
   */
  static renderAppointmentsView() {
    const user = auth.getCurrentUser();
    const appointments = appointmentService.getAppointmentsByDoctor(user.id);

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
      </div>
    `;
  }

  /**
   * Renderiza lista de citas
   */
  static renderAppointmentsList(appointments) {
    if (appointments.length === 0) {
      return '<p class="text-muted">No hay citas</p>';
    }

    return `
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Paciente</th>
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
                <td>${getPatientName(apt.patientId)}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td>${apt.reason}</td>
                <td>${getStatusBadge(apt.status)}</td>
                <td>
                  ${apt.status === 'scheduled' ? `
                    <button class="btn btn-sm btn-success" 
                            onclick="DoctorController.openCompleteForm('${apt.id}')">
                      ✓ Completar
                    </button>
                    <button class="btn btn-sm btn-danger" 
                            onclick="DoctorController.cancelAppointment('${apt.id}')">
                      ✕ Cancelar
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
   * Abre modal para completar cita
   */
  static openCompleteForm(appointmentId) {
    const apt = appointmentService.getAppointmentById(appointmentId);
    const notes = prompt('Ingrese notas de la cita (opcional):', '');
    
    if (notes !== null) {
      this.completeAppointment(appointmentId, notes);
    }
  }

  /**
   * Completa una cita
   */
  static completeAppointment(appointmentId, notes = '') {
    appointmentService.completeAppointment(appointmentId, notes);
    showAlert('Éxito', 'Cita marcada como completada', 'success');
    setTimeout(() => this.renderAppointmentsView(), 1000);
  }

  /**
   * Cancela una cita
   */
  static cancelAppointment(appointmentId) {
    if (confirm('¿Desea cancelar esta cita?')) {
      appointmentService.cancelAppointment(appointmentId);
      showAlert('Éxito', 'Cita cancelada', 'success');
      setTimeout(() => this.renderAppointmentsView(), 1000);
    }
  }

  /**
   * Renderiza vista de mis pacientes
   */
  static renderMyPatientsView() {
    const doctor = auth.getCurrentUser();
    const appointments = appointmentService.getAppointmentsByDoctor(doctor.id);
    
    // Obtener pacientes únicos
    const patientIds = [...new Set(appointments.map(a => a.patientId))];
    
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <h2>Mis Pacientes</h2>
      
      ${patientIds.length === 0 ? `
        <p class="text-muted">No tiene pacientes asignados aún</p>
      ` : `
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Citas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${patientIds.map(patientId => {
                const patient = userService.getUserById(patientId);
                const patientAppointments = appointments.filter(a => a.patientId === patientId);
                return `
                  <tr>
                    <td>${patient.name}</td>
                    <td>${patient.email}</td>
                    <td>${patientAppointments.length}</td>
                    <td>
                      <button class="btn btn-sm btn-info" 
                              onclick="DoctorController.viewPatientMedicalHistory('${patientId}')">
                        <i class="bi bi-file-medical"></i> Historia Clínica
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  }

  /**
   * Renderiza vista de historia clínica del paciente (para doctores - LECTURA Y EDICIÓN)
   */
  static viewPatientMedicalHistory(patientId) {
    const patient = userService.getUserById(patientId);
    const doctor = auth.getCurrentUser();
    const history = medicalHistoryService.getOrCreateHistory(patientId);
    const medicalNotes = medicalHistoryService.getMedicalNotes(patientId);

    const container = document.getElementById('app-container');
    container.innerHTML = `
      <h2>Historia Clínica - ${patient.name}</h2>
      
      <div class="alert alert-warning" role="alert">
        <i class="bi bi-pencil-square"></i> <strong>Nota:</strong> Como doctor, puedes editar toda la información de la historia clínica.
      </div>
      
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" href="#patientInfo" data-bs-toggle="tab">
            Información del Paciente
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#medicalNotes" data-bs-toggle="tab">
            Notas Médicas (${medicalNotes.length})
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
        <li class="nav-item">
          <a class="nav-link" href="#addNote" data-bs-toggle="tab">
            Agregar Nota
          </a>
        </li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="patientInfo">
          <div class="card">
            <div class="card-body">
              <p><strong>Nombre:</strong> ${patient.name}</p>
              <p><strong>Email:</strong> ${patient.email}</p>
              <p><strong>Teléfono:</strong> ${patient.phone || 'No registrado'}</p>
              <p><strong>Historial creado:</strong> ${new Date(history.createdAt).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
              
              <div class="card mt-3">
                <div class="card-header">
                  <h5>Notas Personales del Paciente</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <textarea class="form-control" id="doctorAddNotes" rows="4" placeholder="Agregue notas personales del paciente...">${history.notes || ''}</textarea>
                  </div>
                  <button class="btn btn-primary" onclick="DoctorController.saveDoctorNotes('${patientId}')">
                    <i class="bi bi-save"></i> Guardar Notas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="medicalNotes">
          <div class="card">
            <div class="card-body">
              ${medicalNotes.length === 0 ? `
                <p class="text-muted">No hay notas médicas aún</p>
              ` : `
                <div class="accordion" id="notesAccordion">
                  ${medicalNotes.map((note, idx) => {
                    const noteDoctor = userService.getUserById(note.doctorId);
                    const isOwnNote = note.doctorId === doctor.id;
                    return `
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button ${idx > 0 ? 'collapsed' : ''}" type="button" 
                                  data-bs-toggle="collapse" data-bs-target="#note${idx}">
                            <span class="badge bg-${this.getNoteTypeBg(note.type)} me-2">
                              ${this.getNoteTypeLabel(note.type)}
                            </span>
                            Dr/Dra. ${noteDoctor.name} - ${new Date(note.createdAt).toLocaleDateString('es-ES')}
                          </button>
                        </h2>
                        <div id="note${idx}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}">
                          <div class="accordion-body">
                            <p>${note.note}</p>
                            ${isOwnNote ? `
                              <button class="btn btn-sm btn-danger" 
                                      onclick="DoctorController.deleteMedicalNote('${patientId}', '${note.id}')">
                                <i class="bi bi-trash"></i> Eliminar
                              </button>
                            ` : ''}
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
              <h5>Alergias</h5>
              ${history.allergies.length > 0 ? `
                <ul class="list-group mb-3">
                  ${history.allergies.map(allergy => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <i class="bi bi-exclamation-triangle text-warning"></i> ${allergy}
                      </span>
                      <button class="btn btn-sm btn-danger" 
                              onclick="DoctorController.removeHistoryItem('${patientId}', 'allergy', '${allergy}')">
                        <i class="bi bi-x"></i>
                      </button>
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted mb-3">Sin alergias registradas</p>
              `}
              
              <div class="input-group">
                <input type="text" class="form-control" id="newAllergy" placeholder="Nueva alergia">
                <button class="btn btn-outline-primary" type="button" 
                        onclick="DoctorController.addHistoryItem('${patientId}', 'allergy', document.getElementById('newAllergy').value)">
                  <i class="bi bi-plus"></i> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="diseases">
          <div class="card">
            <div class="card-body">
              <h5>Enfermedades Crónicas</h5>
              ${history.chronicDiseases.length > 0 ? `
                <ul class="list-group mb-3">
                  ${history.chronicDiseases.map(disease => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <i class="bi bi-heart-pulse text-danger"></i> ${disease}
                      </span>
                      <button class="btn btn-sm btn-danger" 
                              onclick="DoctorController.removeHistoryItem('${patientId}', 'disease', '${disease}')">
                        <i class="bi bi-x"></i>
                      </button>
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted mb-3">Sin enfermedades crónicas registradas</p>
              `}
              
              <div class="input-group">
                <input type="text" class="form-control" id="newDisease" placeholder="Nueva enfermedad crónica">
                <button class="btn btn-outline-primary" type="button" 
                        onclick="DoctorController.addHistoryItem('${patientId}', 'disease', document.getElementById('newDisease').value)">
                  <i class="bi bi-plus"></i> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="medications">
          <div class="card">
            <div class="card-body">
              <h5>Medicamentos</h5>
              ${history.medications.length > 0 ? `
                <ul class="list-group mb-3">
                  ${history.medications.map(med => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <i class="bi bi-prescription2 text-info"></i> ${med}
                      </span>
                      <button class="btn btn-sm btn-danger" 
                              onclick="DoctorController.removeHistoryItem('${patientId}', 'medication', '${med}')">
                        <i class="bi bi-x"></i>
                      </button>
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted mb-3">Sin medicamentos registrados</p>
              `}
              
              <div class="input-group">
                <input type="text" class="form-control" id="newMedication" placeholder="Nuevo medicamento">
                <button class="btn btn-outline-primary" type="button" 
                        onclick="DoctorController.addHistoryItem('${patientId}', 'medication', document.getElementById('newMedication').value)">
                  <i class="bi bi-plus"></i> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="surgeries">
          <div class="card">
            <div class="card-body">
              <h5>Cirugías</h5>
              ${history.surgeries.length > 0 ? `
                <ul class="list-group mb-3">
                  ${history.surgeries.map(surgery => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <i class="bi bi-hospital text-primary"></i> ${surgery}
                      </span>
                      <button class="btn btn-sm btn-danger" 
                              onclick="DoctorController.removeHistoryItem('${patientId}', 'surgery', '${surgery}')">
                        <i class="bi bi-x"></i>
                      </button>
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted mb-3">Sin cirugías registradas</p>
              `}
              
              <div class="input-group">
                <input type="text" class="form-control" id="newSurgery" placeholder="Nueva cirugía">
                <button class="btn btn-outline-primary" type="button" 
                        onclick="DoctorController.addHistoryItem('${patientId}', 'surgery', document.getElementById('newSurgery').value)">
                  <i class="bi bi-plus"></i> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="addNote">
          <div class="card">
            <div class="card-header">
              <h4>Agregar Nota Médica</h4>
            </div>
            <div class="card-body">
              <form id="addNoteForm">
                <div class="mb-3">
                  <label for="noteType" class="form-label">Tipo de Nota</label>
                  <select class="form-select" id="noteType" required>
                    <option value="observación">Observación General</option>
                    <option value="diagnóstico">Diagnóstico</option>
                    <option value="tratamiento">Tratamiento</option>
                    <option value="seguimiento">Seguimiento</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="noteContent" class="form-label">Nota Médica</label>
                  <textarea class="form-control" id="noteContent" rows="5" placeholder="Escriba aquí la nota médica..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-save"></i> Guardar Nota
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-secondary" onclick="DoctorController.renderMyPatientsView()">
          <i class="bi bi-arrow-left"></i> Volver a Pacientes
        </button>
      </div>
    `;

    document.getElementById('addNoteForm').addEventListener('submit', (e) => {
      e.preventDefault();
      DoctorController.saveMedicalNote(patientId);
    });
  }

  /**
   * Guarda notas personales del doctor sobre el paciente
   */
  static saveDoctorNotes(patientId) {
    const notes = document.getElementById('doctorAddNotes').value;
    medicalHistoryService.updateNotes(patientId, notes);
    showAlert('Éxito', 'Notas guardadas correctamente', 'success');
    setTimeout(() => this.viewPatientMedicalHistory(patientId), 500);
  }

  /**
   * Guarda una nota médica
   */
  static saveMedicalNote(patientId) {
    const noteType = document.getElementById('noteType').value;
    const noteContent = document.getElementById('noteContent').value;
    const doctor = auth.getCurrentUser();

    if (!noteContent.trim()) {
      showAlert('Error', 'Por favor ingrese el contenido de la nota', 'error');
      return;
    }

    medicalHistoryService.addMedicalNote(patientId, doctor.id, noteContent, noteType);
    showAlert('Éxito', 'Nota médica guardada correctamente', 'success');
    setTimeout(() => this.viewPatientMedicalHistory(patientId), 500);
  }

  /**
   * Elimina una nota médica
   */
  static deleteMedicalNote(patientId, noteId) {
    if (confirm('¿Desea eliminar esta nota?')) {
      medicalHistoryService.removeMedicalNote(patientId, noteId);
      showAlert('Éxito', 'Nota eliminada', 'success');
      setTimeout(() => this.viewPatientMedicalHistory(patientId), 500);
    }
  }

  /**
   * Agrega un item a la historia (alergia, enfermedad, medicamento, cirugía)
   */
  static addHistoryItem(patientId, type, value) {
    if (!value || value.trim() === '') {
      showAlert('Error', 'Por favor ingrese un valor', 'error');
      return;
    }

    const typeMap = {
      'allergy': () => medicalHistoryService.addAllergy(patientId, value),
      'disease': () => medicalHistoryService.addChronicDisease(patientId, value),
      'medication': () => medicalHistoryService.addMedication(patientId, value),
      'surgery': () => medicalHistoryService.addSurgery(patientId, value)
    };

    const action = typeMap[type];
    if (action) {
      action();
      showAlert('Éxito', 'Elemento agregado correctamente', 'success');
      setTimeout(() => this.viewPatientMedicalHistory(patientId), 500);
    }
  }

  /**
   * Remueve un item de la historia
   */
  static removeHistoryItem(patientId, type, value) {
    if (confirm(`¿Desea eliminar este elemento: "${value}"?`)) {
      const typeMap = {
        'allergy': () => medicalHistoryService.removeAllergy(patientId, value),
        'disease': () => medicalHistoryService.removeChronicDisease(patientId, value),
        'medication': () => medicalHistoryService.removeMedication(patientId, value),
        'surgery': () => medicalHistoryService.removeSurgery(patientId, value)
      };

      const action = typeMap[type];
      if (action) {
        action();
        showAlert('Éxito', 'Elemento eliminado', 'success');
        setTimeout(() => this.viewPatientMedicalHistory(patientId), 500);
      }
    }
  }

  /**
   * Obtiene el color de fondo para el tipo de nota
   */
  static getNoteTypeBg(type) {
    const bgMap = {
      'diagnóstico': 'danger',
      'tratamiento': 'info',
      'observación': 'secondary',
      'seguimiento': 'warning'
    };
    return bgMap[type] || 'secondary';
  }

  /**
   * Obtiene la etiqueta para el tipo de nota
   */
  static getNoteTypeLabel(type) {
    const labelMap = {
      'diagnóstico': 'Diagnóstico',
      'tratamiento': 'Tratamiento',
      'observación': 'Observación',
      'seguimiento': 'Seguimiento'
    };
    return labelMap[type] || 'Nota';
  }
}
