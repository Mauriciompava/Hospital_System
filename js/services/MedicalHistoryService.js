/**
 * SERVICIO DE HISTORIA CLÍNICA
 * Gestiona CRUD de historias clínicas de pacientes
 */

class MedicalHistoryService {
  constructor() {
    this.historiesKey = 'medical_histories';
  }

  /**
   * Crea o obtiene historia clínica
   * @param {string} patientId
   * @returns {object} Historia clínica
   */
  getOrCreateHistory(patientId) {
    let history = this.getHistoryByPatient(patientId);
    if (!history) {
      history = {
        id: this.generateId(),
        patientId: patientId,
        allergies: [],
        chronicDiseases: [],
        medications: [],
        surgeries: [],
        notes: '',
        medicalNotes: [], // Notas agregadas por doctores
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      storage.addToCollection(this.historiesKey, history);
      console.log(`✓ Historia clínica creada para paciente: ${patientId}`);
    }
    // Asegurar que existe el array de notas médicas
    if (!history.medicalNotes) {
      history.medicalNotes = [];
    }
    return history;
  }

  /**
   * Obtiene historia clínica de un paciente
   * @param {string} patientId
   * @returns {object|null}
   */
  getHistoryByPatient(patientId) {
    return storage.filterCollection(this.historiesKey, 
      h => h.patientId === patientId
    )[0] || null;
  }

  /**
   * Actualiza historia clínica
   * @param {string} patientId
   * @param {object} updates
   * @returns {object|null}
   */
  updateHistory(patientId, updates) {
    const history = this.getOrCreateHistory(patientId);
    updates.lastUpdated = new Date().toISOString();
    return storage.updateInCollection(this.historiesKey, history.id, updates);
  }

  /**
   * Agrega alergia
   * @param {string} patientId
   * @param {string} allergy
   * @returns {object|null}
   */
  addAllergy(patientId, allergy) {
    const history = this.getOrCreateHistory(patientId);
    if (!history.allergies.includes(allergy)) {
      history.allergies.push(allergy);
      return this.updateHistory(patientId, { allergies: history.allergies });
    }
    return history;
  }

  /**
   * Remueve alergia
   * @param {string} patientId
   * @param {string} allergy
   * @returns {object|null}
   */
  removeAllergy(patientId, allergy) {
    const history = this.getOrCreateHistory(patientId);
    history.allergies = history.allergies.filter(a => a !== allergy);
    return this.updateHistory(patientId, { allergies: history.allergies });
  }

  /**
   * Agrega enfermedad crónica
   * @param {string} patientId
   * @param {string} disease
   * @returns {object|null}
   */
  addChronicDisease(patientId, disease) {
    const history = this.getOrCreateHistory(patientId);
    if (!history.chronicDiseases.includes(disease)) {
      history.chronicDiseases.push(disease);
      return this.updateHistory(patientId, { chronicDiseases: history.chronicDiseases });
    }
    return history;
  }

  /**
   * Remueve enfermedad crónica
   * @param {string} patientId
   * @param {string} disease
   * @returns {object|null}
   */
  removeChronicDisease(patientId, disease) {
    const history = this.getOrCreateHistory(patientId);
    history.chronicDiseases = history.chronicDiseases.filter(d => d !== disease);
    return this.updateHistory(patientId, { chronicDiseases: history.chronicDiseases });
  }

  /**
   * Agrega medicamento
   * @param {string} patientId
   * @param {string} medication
   * @returns {object|null}
   */
  addMedication(patientId, medication) {
    const history = this.getOrCreateHistory(patientId);
    if (!history.medications.includes(medication)) {
      history.medications.push(medication);
      return this.updateHistory(patientId, { medications: history.medications });
    }
    return history;
  }

  /**
   * Remueve medicamento
   * @param {string} patientId
   * @param {string} medication
   * @returns {object|null}
   */
  removeMedication(patientId, medication) {
    const history = this.getOrCreateHistory(patientId);
    history.medications = history.medications.filter(m => m !== medication);
    return this.updateHistory(patientId, { medications: history.medications });
  }

  /**
   * Agrega cirugía
   * @param {string} patientId
   * @param {string} surgery
   * @returns {object|null}
   */
  addSurgery(patientId, surgery) {
    const history = this.getOrCreateHistory(patientId);
    if (!history.surgeries.includes(surgery)) {
      history.surgeries.push(surgery);
      return this.updateHistory(patientId, { surgeries: history.surgeries });
    }
    return history;
  }

  /**
   * Remueve cirugía
   * @param {string} patientId
   * @param {string} surgery
   * @returns {object|null}
   */
  removeSurgery(patientId, surgery) {
    const history = this.getOrCreateHistory(patientId);
    history.surgeries = history.surgeries.filter(s => s !== surgery);
    return this.updateHistory(patientId, { surgeries: history.surgeries });
  }

  /**
   * Actualiza notas clínicas
   * @param {string} patientId
   * @param {string} notes
   * @returns {object|null}
   */
  updateNotes(patientId, notes) {
    return this.updateHistory(patientId, { notes: notes });
  }

  /**
   * Agrega nota médica del doctor
   * @param {string} patientId
   * @param {string} doctorId
   * @param {string} note
   * @param {string} type - diagnóstico, tratamiento, observación
   * @returns {object|null}
   */
  addMedicalNote(patientId, doctorId, note, type = 'observación') {
    const history = this.getOrCreateHistory(patientId);
    if (!history.medicalNotes) {
      history.medicalNotes = [];
    }

    const medicalNote = {
      id: this.generateId(),
      doctorId: doctorId,
      note: note,
      type: type, // diagnóstico, tratamiento, observación
      createdAt: new Date().toISOString()
    };

    history.medicalNotes.push(medicalNote);
    return this.updateHistory(patientId, { medicalNotes: history.medicalNotes });
  }

  /**
   * Obtiene notas médicas de un paciente
   * @param {string} patientId
   * @returns {array}
   */
  getMedicalNotes(patientId) {
    const history = this.getHistoryByPatient(patientId);
    return history && history.medicalNotes ? history.medicalNotes : [];
  }

  /**
   * Elimina una nota médica
   * @param {string} patientId
   * @param {string} noteId
   * @returns {object|null}
   */
  removeMedicalNote(patientId, noteId) {
    const history = this.getOrCreateHistory(patientId);
    if (!history.medicalNotes) {
      return history;
    }
    history.medicalNotes = history.medicalNotes.filter(n => n.id !== noteId);
    return this.updateHistory(patientId, { medicalNotes: history.medicalNotes });
  }

  /**
   * Obtiene todas las historias clínicas
   * @returns {array}
   */
  getAllHistories() {
    return storage.getCollection(this.historiesKey);
  }

  /**
   * Genera ID único
   * @returns {string}
   */
  generateId() {
    return 'h_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

const medicalHistoryService = new MedicalHistoryService();
