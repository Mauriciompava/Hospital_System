/**
 * SERVICIO DE AUTENTICACIÓN
 * Gestiona login, logout, registro y validación de sesión
 */

class AuthService {
  constructor() {
    this.sessionKey = 'hospital_current_user';
    this.usersKey = 'users';
  }

  /**
   * Realiza el login de un usuario
   * @param {string} username
   * @param {string} password
   * @returns {object|null} Usuario si es válido, null si no
   */
  login(username, password) {
    const users = storage.getCollection(this.usersKey);
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Guardar sesión en sessionStorage (no persiste al cerrar navegador)
      sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
      console.log(`✓ Login exitoso: ${user.name}`);
      return user;
    }
    console.error('✗ Credenciales inválidas');
    return null;
  }

  /**
   * Obtiene el usuario actualmente autenticado
   * @returns {object|null}
   */
  getCurrentUser() {
    const user = sessionStorage.getItem(this.sessionKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Cierra sesión
   */
  logout() {
    sessionStorage.removeItem(this.sessionKey);
    console.log('✓ Logout exitoso');
  }

  /**
   * Registra un nuevo usuario
   * @param {object} userData - {username, password, role, name, email}
   * @returns {object|null} Usuario creado o null si falla
   */
  register(userData) {
    const users = storage.getCollection(this.usersKey);
    
    // Validar que username no exista
    if (users.some(u => u.username === userData.username)) {
      console.error('✗ El usuario ya existe');
      return null;
    }

    const newUser = {
      id: this.generateId(),
      username: userData.username,
      password: userData.password,
      role: userData.role || 'patient',
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString()
    };

    storage.addToCollection(this.usersKey, newUser);
    console.log(`✓ Usuario registrado: ${newUser.name}`);
    return newUser;
  }

  /**
   * Genera un ID único (timestamp + random)
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} requiredRole
   * @returns {boolean}
   */
  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    return user && user.role === requiredRole;
  }

  /**
   * Verifica si el usuario tiene alguno de los roles
   * @param {array} roles
   * @returns {boolean}
   */
  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return user && roles.includes(user.role);
  }
}

const auth = new AuthService();
