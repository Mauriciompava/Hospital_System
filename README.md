# 🏥 Sistema de Gestión Hospitalaria - Frontend

Sistema completo de gestión hospitalaria desarrollado 100% en **Frontend** con **HTML5, CSS3, Bootstrap 5 y JavaScript Vanilla**.

## 🎯 Características Principales

✅ **Autenticación segura** con sessionStorage  
✅ **Control de acceso por roles**: Administrador, Doctor, Paciente  
✅ **Persistencia total en localStorage** (sin backend necesario)  
✅ **Gestión de citas médicas** con CRUD completo  
✅ **Disponibilidad de doctores** (horarios por día)  
✅ **Interfaz responsiva** con Bootstrap 5  
✅ **Tablas, formularios y validaciones** visuales  

---

## 📁 Estructura del Proyecto

```
hospital-system/
│
├── index.html                          # Página principal (punto de entrada)
│
├── assets/
│   └── css/
│       └── styles.css                  # Estilos personalizados
│
├── js/
│   ├── app.js                          # Aplicación principal
│   │
│   ├── services/
│   │   ├── StorageService.js          # Gestión de localStorage
│   │   ├── AuthService.js             # Autenticación y Login
│   │   ├── UserService.js             # Gestión de usuarios (CRUD)
│   │   ├── AppointmentService.js      # Gestión de citas médicas
│   │   └── DoctorService.js           # Disponibilidad de doctores
│   │
│   ├── controllers/
│   │   ├── AuthController.js          # Lógica de login/dashboard
│   │   ├── AdminController.js         # Panel de administrador
│   │   ├── DoctorController.js        # Panel de doctor
│   │   └── PatientController.js       # Panel de paciente
│   │
│   ├── models/
│   │   ├── DataModels.js              # Estructura de datos
│   │   └── InitializeData.js          # Carga de datos por defecto
│   │
│   ├── utils/
│   │   ├── helpers.js                 # Funciones auxiliares
│   │   └── validators.js              # Validación de formularios
│   │
│   └── config/
│       └── ViewLoader.js              # Cargador de vistas
│
├── views/                              # Vistas HTML por rol (estructura)
│   ├── auth/
│   ├── admin/
│   ├── doctor/
│   └── patient/
│
└── docs/                               # Documentación
```

---

## 🚀 Cómo Usar

### 1. **Abrir la Aplicación**

Simplemente abre el archivo `index.html` en tu navegador:

```
double-click index.html
```

O con servidor local (recomendado):

```bash
python -m http.server 8000
# O con Node.js
npx http-server
```

Luego accede a: `http://localhost:8000`

---

## 👤 Credenciales de Prueba

| Rol | Usuario | Contraseña |
|-----|---------|-----------|
| **Administrador** | `admin` | `admin123` |
| **Doctor 1** | `doctor1` | `doctor123` |
| **Doctor 2** | `doctor2` | `doctor123` |
| **Paciente 1** | `juan` | `patient123` |
| **Paciente 2** | `ana` | `patient123` |

---

## 📋 Funcionalidades por Rol

### 🔐 **Administrador**

**Dashboard:**
- Estadísticas de usuarios y citas
- Contador de doctores, pacientes y citas

**Gestión de Usuarios:**
- Ver lista completa de usuarios
- Crear nuevos usuarios (con validación)
- Editar y eliminar usuarios
- Filtrar por rol

**Gestión de Citas:**
- Ver todas las citas del sistema
- Cancelar citas si es necesario
- Ver detalles de citas

### 🏥 **Doctor**

**Dashboard:**
- Resumen de citas programadas y completadas
- Vista de próximas citas

**Mi Agenda:**
- Configurar disponibilidad semanal
- Establecer horarios de atención por día
- Guardar cambios automáticamente

**Mis Citas:**
- Ver citas programadas
- Marcar citas como completadas
- Agregar notas a citas
- Cancelar citas

### 👨‍⚕️ **Paciente**

**Dashboard:**
- Resumen de citas programadas y completadas
- Vista rápida de próximas citas

**Agendar Cita:**
- Seleccionar doctor
- Elegir fecha disponible
- Ver horarios disponibles en tiempo real
- Indicar motivo de la consulta

**Mis Citas:**
- Ver citas programadas, completadas y canceladas
- Cancelar citas programadas
- Historial completo

---

## 💾 Datos y Persistencia

### **localStorage**

Los datos se guardan automáticamente en el navegador:

```javascript
// Usuarios
hospital_users

// Citas médicas
hospital_appointments

// Disponibilidad de doctores
hospital_doctor_availability
```

Para **limpiar datos**, abre la consola y ejecuta:

```javascript
localStorage.clear();
location.reload();
```

---

## 🔧 Arquitectura Técnica

### **Servicios**

#### `StorageService`
```javascript
storage.getItem('key')
storage.setItem('key', value)
storage.getCollection('key')
storage.addToCollection('key', item)
storage.updateInCollection('key', id, updates)
```

#### `AuthService`
```javascript
auth.login(username, password)
auth.logout()
auth.getCurrentUser()
auth.isAuthenticated()
auth.hasRole(role)
```

#### `UserService`
```javascript
userService.getAllUsers()
userService.getUserById(id)
userService.getUsersByRole(role)
userService.updateUser(id, updates)
userService.deleteUser(id)
```

#### `AppointmentService`
```javascript
appointmentService.createAppointment(data)
appointmentService.getAppointmentsByPatient(patientId)
appointmentService.getAppointmentsByDoctor(doctorId)
appointmentService.cancelAppointment(appointmentId)
appointmentService.completeAppointment(appointmentId, notes)
```

#### `DoctorService`
```javascript
doctorService.setAvailability(doctorId, availability)
doctorService.getAvailableTimeSlots(doctorId, date)
doctorService.getAvailableDoctors(date)
```

### **Controladores**

- **AuthController**: Login/Logout, redirección según rol
- **AdminController**: Gestión de usuarios y citas
- **DoctorController**: Agenda y citas del doctor
- **PatientController**: Reserva y visualización de citas

---

## ✨ Características Especiales

### **Validación de Formularios**

```javascript
validate.validateLogin(username, password)
validate.validateRegistration(username, password, name, email)
validate.validateAppointment(doctorId, date, time)
validate.displayErrors(elementId, errors)
```

### **Utilidades**

```javascript
formatDate(date)                 // YYYY-MM-DD
formatTime(time)                 // HH:MM
formatDateTime(date, time)       // Formato legible
getDayName(date)                 // "Lunes", "Martes", etc.
getStatusBadge(status)           // Badge HTML coloreado
getRoleName(role)                // "Administrador", "Doctor", "Paciente"
showAlert(title, message, type)  // Modal de alerta
```

---

## 🎨 Interfaz

### **Bootstrap 5**
- Componentes responsivos
- Grid system
- Cards, tables, forms, alerts, badges
- Modal dialogs
- Navbar sticky con menú dinámico

### **Estilos Personalizados**
- Colores corporativos
- Animaciones suaves
- Efectos hover
- Scrollbar personalizado
- Tema claro y profesional

---

## 🔒 Seguridad

⚠️ **Nota:** Este es un sistema de prueba de concepto. Para producción:

- No almacenar contraseñas en texto plano
- Usar un backend con autenticación JWT
- Implementar hash de contraseñas (bcrypt, argon2)
- Usar HTTPS
- Implementar rate limiting
- Validar en servidor

---

## 📱 Responsive

Funciona perfectamente en:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Móvil (< 768px)

---

## 🛠️ Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- localStorage disponible
- Conexión a CDN para Bootstrap 5

---

## 📚 Modelos de Datos

### **Usuario**
```javascript
{
  id: "unique-id",
  username: "juan",
  password: "patient123",
  role: "patient", // admin | doctor | patient
  name: "Juan Pérez",
  email: "juan@email.com",
  createdAt: "2025-02-10T..."
}
```

### **Cita Médica**
```javascript
{
  id: "apt-id",
  patientId: "patient-001",
  doctorId: "doctor-001",
  date: "2025-02-15",
  time: "10:00",
  reason: "Consulta general",
  status: "scheduled", // scheduled | completed | cancelled
  notes: "",
  createdAt: "2025-02-10T...",
  updatedAt: "2025-02-10T..."
}
```

### **Disponibilidad de Doctor**
```javascript
{
  id: "davail-id",
  doctorId: "doctor-001",
  availability: {
    monday: ["09:00", "17:00"],
    tuesday: ["09:00", "17:00"],
    wednesday: [],
    // ... resto de días
  },
  updatedAt: "2025-02-10T..."
}
```

---

## 🐛 Troubleshooting

### Los datos no se guardan
- Verifica que localStorage esté habilitado
- Comprueba la consola (F12) para errores

### Problemas de autenticación
- Limpia sessionStorage: `sessionStorage.clear()`
- Recarga la página: `location.reload()`

### Estilos no cargan correctamente
- Verifica que Bootstrap 5 CDN esté disponible
- Comprueba que `styles.css` existe

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

---

## 👨‍💻 Autor

Desarrollado como un Sistema de Gestión Hospitalaria 100% Frontend.

**Versión:** 1.0  
**Fecha:** Febrero 2025  
**Stack:** HTML5 + CSS3 + Bootstrap 5 + JavaScript Vanilla + localStorage

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¡Gracias por usar el Sistema de Gestión Hospitalaria! 🏥**
#   H o s p i t a l _ S y s t e m  
 