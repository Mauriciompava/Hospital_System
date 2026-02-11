/**
 * SERVICIO DE ALMACENAMIENTO LOCAL (localStorage)
 * 
 * Gestiona toda la persistencia de datos en el navegador.
 * Proporciona métodos para guardar, recuperar y eliminar datos.
 * 
 * @author Sistema de Gestión Hospitalaria
 * @version 1.0
 */

class StorageService {
  constructor() {
    this.storagePrefix = 'hospital_';
  }

  /**
   * Obtiene un elemento del localStorage
   * @param {string} key - Clave del elemento
   * @param {*} defaultValue - Valor por defecto
   * @returns {*} Valor almacenado o por defecto
   */
  getItem(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(`${this.storagePrefix}${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error al obtener ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Guarda un elemento en localStorage
   * @param {string} key - Clave
   * @param {*} value - Valor
   * @returns {boolean}
   */
  setItem(key, value) {
    try {
      localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error al guardar ${key}:`, error);
      return false;
    }
  }

  /**
   * Elimina un elemento
   */
  removeItem(key) {
    try {
      localStorage.removeItem(`${this.storagePrefix}${key}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar ${key}:`, error);
      return false;
    }
  }

  /**
   * Obtiene un array y lo prepara para manipulación
   */
  getCollection(key) {
    const data = this.getItem(key);
    return Array.isArray(data) ? data : [];
  }

  /**
   * Guarda una colección completa
   */
  setCollection(key, collection) {
    if (!Array.isArray(collection)) {
      console.error('setCollection requiere un array');
      return false;
    }
    return this.setItem(key, collection);
  }

  /**
   * Añade un objeto a una colección
   */
  addToCollection(key, item) {
    const collection = this.getCollection(key);
    collection.push(item);
    this.setCollection(key, collection);
    return collection;
  }

  /**
   * Actualiza un objeto en una colección
   */
  updateInCollection(key, id, updates) {
    const collection = this.getCollection(key);
    const index = collection.findIndex(item => item.id === id);
    
    if (index !== -1) {
      collection[index] = { ...collection[index], ...updates };
      this.setCollection(key, collection);
      return collection[index];
    }
    return null;
  }

  /**
   * Elimina un objeto de una colección
   */
  removeFromCollection(key, id) {
    const collection = this.getCollection(key);
    const filtered = collection.filter(item => item.id !== id);
    
    if (filtered.length < collection.length) {
      this.setCollection(key, filtered);
      return true;
    }
    return false;
  }

  /**
   * Busca un objeto en una colección
   */
  findInCollection(key, id) {
    const collection = this.getCollection(key);
    return collection.find(item => item.id === id) || null;
  }

  /**
   * Filtra una colección
   */
  filterCollection(key, predicate) {
    const collection = this.getCollection(key);
    return collection.filter(predicate);
  }
}

const storage = new StorageService();
