/**
 * CONTROLADOR PARA ADMINISTRADOR
 * Gestiona usuarios, citas y estadísticas
 */

class AdminController {
  /**
   * Renderiza el dashboard del admin
   */
  static renderDashboard() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
      AuthController.renderLoginView();
      return;
    }

    const stats = userService.getUserStatistics();
    const appointmentStats = appointmentService.getAppointmentStatistics();

    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="row">
        <div class="col-md-3">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <h5 class="card-title">Usuarios</h5>
              <p class="card-text display-4">${stats.total}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-success">
            <div class="card-body">
              <h5 class="card-title">Doctores</h5>
              <p class="card-text display-4">${stats.doctors}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-info">
            <div class="card-body">
              <h5 class="card-title">Pacientes</h5>
              <p class="card-text display-4">${stats.patients}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-warning">
            <div class="card-body">
              <h5 class="card-title">Citas</h5>
              <p class="card-text display-4">${appointmentStats.total}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Citas Programadas</h5>
            </div>
            <div class="card-body">
              <p class="h3 mb-0">${appointmentStats.scheduled}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Citas Completadas</h5>
            </div>
            <div class="card-body">
              <p class="h3 mb-0 text-success">${appointmentStats.completed}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza vista de gestión de usuarios
   */
  static renderUsersView() {
    const users = userService.getAllUsers();
    const container = document.getElementById('app-container');

    container.innerHTML = `
      <h2>Gestión de Usuarios</h2>
      <button class="btn btn-primary mb-3" onclick="AdminController.renderAddUserView()">
        <i class="bi bi-plus"></i> Agregar Usuario
      </button>

      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-info">${getRoleName(user.role)}</span></td>
                <td>
                  <button class="btn btn-sm btn-warning" 
                          onclick="AdminController.renderEditUserView('${user.id}')">
                    <i class="bi bi-pencil"></i> Editar
                  </button>
                  <button class="btn btn-sm btn-danger" 
                          onclick="AdminController.deleteUser('${user.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Renderiza vista para agregar usuario
   */
  static renderAddUserView() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <h2>Agregar Nuevo Usuario</h2>
      <div class="row">
        <div class="col-md-6">
          <div id="userErrors"></div>
          <form id="addUserForm">
            <div class="mb-3">
              <label for="newUsername" class="form-label">Usuario</label>
              <input type="text" class="form-control" id="newUsername" required>
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="newPassword" required>
            </div>
            <div class="mb-3">
              <label for="newName" class="form-label">Nombre Completo</label>
              <input type="text" class="form-control" id="newName" required>
            </div>
            <div class="mb-3">
              <label for="newEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="newEmail" required>
            </div>
            <div class="mb-3">
              <label for="newRole" class="form-label">Rol</label>
              <select class="form-select" id="newRole" required>
                <option value="">Seleccionar rol</option>
                <option value="admin">Administrador</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Paciente</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Crear Usuario</button>
            <button type="button" class="btn btn-secondary" onclick="AdminController.renderUsersView()">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('addUserForm').addEventListener('submit', (e) => {
      e.preventDefault();
      AdminController.handleAddUser();
    });
  }

  /**
   * Maneja la creación de usuario
   */
  static handleAddUser() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const name = document.getElementById('newName').value;
    const email = document.getElementById('newEmail').value;
    const role = document.getElementById('newRole').value;

    const validation = validate.validateRegistration(username, password, name, email);
    if (!validation.valid) {
      validate.displayErrors('userErrors', validation.errors);
      return;
    }

    const result = auth.register({ username, password, role, name, email });
    if (result) {
      showAlert('Éxito', 'Usuario creado correctamente', 'success');
      setTimeout(() => AdminController.renderUsersView(), 1000);
    } else {
      validate.displayErrors('userErrors', ['El usuario ya existe']);
    }
  }

  /**
   * Elimina un usuario
   */
  static deleteUser(userId) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      userService.deleteUser(userId);
      showAlert('Éxito', 'Usuario eliminado', 'success');
      setTimeout(() => AdminController.renderUsersView(), 1000);
    }
  }

  /**
   * Renderiza vista de gestión de citas
   */
  static renderAppointmentsView() {
    const appointments = appointmentService.getAllAppointments();
    const container = document.getElementById('app-container');

    container.innerHTML = `
      <h2>Gestión de Citas Médicas</h2>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Doctor</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(apt => `
              <tr>
                <td>${getPatientName(apt.patientId)}</td>
                <td>${getDoctorName(apt.doctorId)}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td>${getStatusBadge(apt.status)}</td>
                <td>
                  <button class="btn btn-sm btn-info" 
                          onclick="AdminController.viewAppointmentDetails('${apt.id}')">
                    <i class="bi bi-eye"></i> Ver
                  </button>
                  ${apt.status === 'scheduled' ? `
                    <button class="btn btn-sm btn-danger" 
                            onclick="AdminController.cancelAppointment('${apt.id}')">
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
   * Ver detalles de cita
   */
  static viewAppointmentDetails(appointmentId) {
    const apt = appointmentService.getAppointmentById(appointmentId);
    showAlert(
      'Detalles de Cita',
      `Paciente: ${getPatientName(apt.patientId)}<br>
       Doctor: ${getDoctorName(apt.doctorId)}<br>
       Fecha: ${apt.date}<br>
       Hora: ${apt.time}<br>
       Motivo: ${apt.reason}`,
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
      setTimeout(() => AdminController.renderAppointmentsView(), 1000);
    }
  }

  /**
   * Renderiza vista para editar usuario
   */
  static renderEditUserView(userId) {
    const user = userService.getUserById(userId);
    if (!user) {
      showAlert('Error', 'Usuario no encontrado', 'error');
      return;
    }

    const container = document.getElementById('app-container');
    container.innerHTML = `
      <h2>Editar Usuario</h2>
      <div class="row">
        <div class="col-md-6">
          <div id="editErrors"></div>
          <form id="editUserForm">
            <div class="mb-3">
              <label for="editName" class="form-label">Nombre Completo</label>
              <input type="text" class="form-control" id="editName" value="${user.name}" required>
            </div>
            <div class="mb-3">
              <label for="editEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="editEmail" value="${user.email}" required>
            </div>
            <div class="mb-3">
              <label for="editUsername" class="form-label">Usuario</label>
              <input type="text" class="form-control" id="editUsername" value="${user.username}" required>
            </div>
            <div class="mb-3">
              <label for="editRole" class="form-label">Rol</label>
              <select class="form-select" id="editRole" required>
                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                <option value="doctor" ${user.role === 'doctor' ? 'selected' : ''}>Doctor</option>
                <option value="patient" ${user.role === 'patient' ? 'selected' : ''}>Paciente</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="editPassword" class="form-label">Nueva Contraseña (dejar vacío para mantener)</label>
              <input type="password" class="form-control" id="editPassword">
            </div>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
            ${user.role === 'patient' ? `
              <button type="button" class="btn btn-info" onclick="AdminController.viewPatientMedicalHistoryReadOnly('${user.id}')">
                <i class="bi bi-file-medical"></i> Ver Historia Clínica
              </button>
            ` : ''}
            <button type="button" class="btn btn-secondary" onclick="AdminController.renderUsersView()">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('editUserForm').addEventListener('submit', (e) => {
      e.preventDefault();
      AdminController.handleEditUser(userId);
    });
  }

  /**
   * Maneja la actualización de usuario
   */
  static handleEditUser(userId) {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const username = document.getElementById('editUsername').value;
    const role = document.getElementById('editRole').value;
    const password = document.getElementById('editPassword').value;

    // Validar que los campos no estén vacíos
    if (!name || !email || !username || !role) {
      validate.displayErrors('editErrors', ['Todos los campos son requeridos']);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validate.displayErrors('editErrors', ['Email inválido']);
      return;
    }

    const updates = {
      name: name,
      email: email,
      username: username,
      role: role
    };

    if (password) {
      updates.password = password;
    }

    const result = userService.updateUser(userId, updates);
    if (result) {
      showAlert('Éxito', 'Usuario actualizado correctamente', 'success');
      setTimeout(() => AdminController.renderUsersView(), 1000);
    } else {
      validate.displayErrors('editErrors', ['Error al actualizar el usuario']);
    }
  }

  /**
   * Ver historia clínica del paciente (SOLO LECTURA para admin)
   */
  static viewPatientMedicalHistoryReadOnly(patientId) {
    const user = userService.getUserById(patientId);
    const history = medicalHistoryService.getOrCreateHistory(patientId);
    const medicalNotes = medicalHistoryService.getMedicalNotes(patientId);

    const container = document.getElementById('app-container');
    container.innerHTML = `
      <h2>Historia Clínica (Lectura) - ${user.name}</h2>
      
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle"></i> <strong>Nota:</strong> Como administrador, puedes ver la historia clínica pero no editarla. 
        Para realizar cambios, el doctor del paciente debe actualizar esta información.
      </div>
      
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" href="#generalInfo" data-bs-toggle="tab">
            Información General
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
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="generalInfo">
          <div class="card">
            <div class="card-body">
              <p><strong>Paciente:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Última actualización:</strong> ${new Date(history.lastUpdated).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
              ${history.notes ? `
                <div class="card mt-3 bg-light">
                  <div class="card-header">
                    <h5>Notas Clínicas</h5>
                  </div>
                  <div class="card-body">
                    <p>${history.notes}</p>
                  </div>
                </div>
              ` : `
                <div class="alert alert-secondary mt-3">Sin notas clínicas registradas</div>
              `}
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
                <h5>Alergias</h5>
                <ul class="list-group">
                  ${history.allergies.map(allergy => `
                    <li class="list-group-item">
                      <i class="bi bi-exclamation-triangle text-warning"></i> ${allergy}
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted">Sin alergias registradas</p>
              `}
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="diseases">
          <div class="card">
            <div class="card-body">
              ${history.chronicDiseases.length > 0 ? `
                <h5>Enfermedades Crónicas</h5>
                <ul class="list-group">
                  ${history.chronicDiseases.map(disease => `
                    <li class="list-group-item">
                      <i class="bi bi-heart-pulse text-danger"></i> ${disease}
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted">Sin enfermedades crónicas registradas</p>
              `}
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="medications">
          <div class="card">
            <div class="card-body">
              ${history.medications.length > 0 ? `
                <h5>Medicamentos</h5>
                <ul class="list-group">
                  ${history.medications.map(med => `
                    <li class="list-group-item">
                      <i class="bi bi-prescription2 text-info"></i> ${med}
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted">Sin medicamentos registrados</p>
              `}
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="surgeries">
          <div class="card">
            <div class="card-body">
              ${history.surgeries.length > 0 ? `
                <h5>Cirugías</h5>
                <ul class="list-group">
                  ${history.surgeries.map(surgery => `
                    <li class="list-group-item">
                      <i class="bi bi-hospital text-primary"></i> ${surgery}
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="text-muted">Sin cirugías registradas</p>
              `}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-secondary" onclick="AdminController.renderEditUserView('${patientId}')">
          <i class="bi bi-arrow-left"></i> Volver
        </button>
      </div>
    `;
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
