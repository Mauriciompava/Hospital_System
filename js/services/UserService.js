/**
 * SERVICIO DE USUARIOS
 * Gestiona CRUD de usuarios
 */

class UserService {
  constructor() {
    this.usersKey = 'users';
  }

  /**
   * Obtiene todos los usuarios
   * @returns {array}
   */
  getAllUsers() {
    return storage.getCollection(this.usersKey);
  }

  /**
   * Obtiene un usuario por ID
   * @param {string} userId
   * @returns {object|null}
   */
  getUserById(userId) {
    return storage.findInCollection(this.usersKey, userId);
  }

  /**
   * Obtiene usuarios por rol
   * @param {string} role
   * @returns {array}
   */
  getUsersByRole(role) {
    return storage.filterCollection(this.usersKey, user => user.role === role);
  }

  /**
   * Actualiza un usuario
   * @param {string} userId
   * @param {object} updates
   * @returns {object|null}
   */
  updateUser(userId, updates) {
    const updated = storage.updateInCollection(this.usersKey, userId, updates);
    if (updated) {
      console.log(`✓ Usuario actualizado: ${updated.name}`);
      // Si es el usuario actual, actualizar sesión
      const currentUser = auth.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        sessionStorage.setItem('hospital_current_user', JSON.stringify(updated));
      }
    }
    return updated;
  }

  /**
   * Elimina un usuario
   * @param {string} userId
   * @returns {boolean}
   */
  deleteUser(userId) {
    const success = storage.removeFromCollection(this.usersKey, userId);
    if (success) {
      console.log('✓ Usuario eliminado');
    }
    return success;
  }

  /**
   * Obtiene estadísticas de usuarios
   * @returns {object}
   */
  getUserStatistics() {
    const users = this.getAllUsers();
    return {
      total: users.length,
      doctors: users.filter(u => u.role === 'doctor').length,
      patients: users.filter(u => u.role === 'patient').length,
      admins: users.filter(u => u.role === 'admin').length
    };
  }
}

const userService = new UserService();
