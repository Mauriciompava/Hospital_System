/**
 * CONTROLADOR DE AUTENTICACIÓN
 * Maneja login y registro
 */

class AuthController {
    /**
     * Renderiza la vista de login
     */
    static renderLoginView() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg mt-5">
            <div class="card-header bg-primary text-white text-center">
              <h3 class="mb-0">
                <i class="bi bi-hospital"></i> Hospital System
              </h3>
            </div>
            <div class="card-body">
              <div id="loginErrors"></div>
              <form id="loginForm">
                <div class="mb-3">
                  <label for="loginUsername" class="form-label">Usuario</label>
                  <input type="text" class="form-control" id="loginUsername" 
                         placeholder="Ingrese su usuario" required>
                </div>
                <div class="mb-3">
                  <label for="loginPassword" class="form-label">Contraseña</label>
                  <input type="password" class="form-control" id="loginPassword" 
                         placeholder="Ingrese su contraseña" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 mb-3">Ingresar</button>
              </form>
              
              <hr>
              <p class="text-center text-muted mb-0">
                <small>Demo: admin/admin123 | doctor1/doctor123 | juan/patient123</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

        // Event listeners
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    /**
     * Maneja el envío del formulario de login
     */
    static handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Validar
        const validation = validate.validateLogin(username, password);
        if (!validation.valid) {
            validate.displayErrors('loginErrors', validation.errors);
            return;
        }

        // Intentar login
        const user = auth.login(username, password);
        if (user) {
            showAlert('Éxito', `¡Bienvenido ${user.name}!`, 'success');
            setTimeout(() => {
                this.renderDashboard();
            }, 1000);
        } else {
            validate.displayErrors('loginErrors', ['Usuario o contraseña incorrectos']);
        }
    }

    /**
     * Renderiza el dashboard según el rol del usuario
     */
    static renderDashboard() {
        const user = auth.getCurrentUser();
        if (!user) {
            this.renderLoginView();
            return;
        }

        // Mostrar menú según rol
        this.updateNavbar(user);

        // Renderizar dashboard según rol
        switch (user.role) {
            case 'admin':
                AdminController.renderDashboard();
                break;
            case 'doctor':
                DoctorController.renderDashboard();
                break;
            case 'patient':
                PatientController.renderDashboard();
                break;
            default:
                this.renderLoginView();
        }
    }

    /**
     * Actualiza la navbar según el rol
     */
    static updateNavbar(user) {
        const navbarMenu = document.getElementById('navbarMenu');
        let menuItems = '';

        if (user.role === 'admin') {
            menuItems = `
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="AdminController.renderDashboard()">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="AdminController.renderUsersView()">Usuarios</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="AdminController.renderAppointmentsView()">Citas</a>
        </li>
      `;
        } else if (user.role === 'doctor') {
            menuItems = `
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="DoctorController.renderDashboard()">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="DoctorController.renderScheduleView()">Mi Agenda</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="DoctorController.renderAppointmentsView()">Mis Citas</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="DoctorController.renderMyPatientsView()">Mis Pacientes</a>
        </li>
      `;
        } else if (user.role === 'patient') {
            menuItems = `
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="PatientController.renderDashboard()">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="PatientController.renderBookingView()">Agendar Cita</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="PatientController.renderMyAppointmentsView()">Mis Citas</a>
        </li>
      `;
        }

        menuItems += `
      <li class="nav-item">
        <span class="nav-link text-white">
          <i class="bi bi-person"></i> ${user.name}
        </span>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" onclick="handleLogout()">Salir</a>
      </li>
    `;

        navbarMenu.innerHTML = menuItems;
        document.getElementById('navbar').style.display = 'flex';
    }
}

// Verificar autenticación al cargar
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isAuthenticated()) {
        AuthController.renderDashboard();
    } else {
        AuthController.renderLoginView();
    }
});
