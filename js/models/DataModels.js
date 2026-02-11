/**
 * MODELOS DE DATOS
 * Define la estructura de los datos en localStorage
 */

// Estructura de Usuario
const UserModel = {
  id: '',
  username: '',
  password: '',
  role: 'patient', // 'admin' | 'doctor' | 'patient'
  name: '',
  email: '',
  createdAt: ''
};

// Estructura de Cita Médica
const AppointmentModel = {
  id: '',
  patientId: '',
  doctorId: '',
  date: '',
  time: '',
  reason: '',
  status: 'scheduled', // 'scheduled' | 'completed' | 'cancelled'
  notes: '',
  createdAt: '',
  updatedAt: ''
};

// Estructura de Disponibilidad de Doctor
const DoctorAvailabilityModel = {
  id: '',
  doctorId: '',
  availability: {
    monday: ['09:00', '17:00'],
    tuesday: ['09:00', '17:00'],
    wednesday: ['09:00', '17:00'],
    thursday: ['09:00', '17:00'],
    friday: ['09:00', '17:00'],
    saturday: [],
    sunday: []
  },
  updatedAt: ''
};

// Datos por defecto de prueba
const DEFAULT_USERS = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrador del Hospital',
    email: 'admin@hospital.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doctor-001',
    username: 'doctor1',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Carlos Rodríguez',
    email: 'carlos@hospital.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doctor-002',
    username: 'doctor2',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dra. María García',
    email: 'maria@hospital.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'patient-001',
    username: 'juan',
    password: 'patient123',
    role: 'patient',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 'patient-002',
    username: 'ana',
    password: 'patient123',
    role: 'patient',
    name: 'Ana López',
    email: 'ana@email.com',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_DOCTOR_AVAILABILITY = [
  {
    id: 'davail-001',
    doctorId: 'doctor-001',
    availability: {
      monday: ['09:00', '17:00'],
      tuesday: ['09:00', '17:00'],
      wednesday: ['10:00', '16:00'],
      thursday: ['09:00', '17:00'],
      friday: ['09:00', '14:00'],
      saturday: [],
      sunday: []
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: 'davail-002',
    doctorId: 'doctor-002',
    availability: {
      monday: ['10:00', '18:00'],
      tuesday: [],
      wednesday: ['10:00', '18:00'],
      thursday: ['10:00', '18:00'],
      friday: ['10:00', '18:00'],
      saturday: ['09:00', '13:00'],
      sunday: []
    },
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: 'apt-001',
    patientId: 'patient-001',
    doctorId: 'doctor-001',
    date: '2025-02-15',
    time: '10:00',
    reason: 'Consulta general',
    status: 'scheduled',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-002',
    patientId: 'patient-002',
    doctorId: 'doctor-002',
    date: '2025-02-16',
    time: '14:30',
    reason: 'Revisión de síntomas',
    status: 'scheduled',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
