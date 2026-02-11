# 🧪 Guía de Testing - Sistema de Gestión Hospitalaria

Esta guía te ayudará a probar todas las funcionalidades del sistema.

---

## ✅ Inicio Rápido

1. **Abre `index.html`** en tu navegador
2. Ve a la **tabla de credenciales** abajo
3. Prueba cada rol según las instrucciones

---

## 🔑 Credenciales de Prueba

| Rol | Usuario | Contraseña | Pruebas |
|-----|---------|-----------|---------|
| Admin | `admin` | `admin123` | Gestión de usuarios y citas |
| Doctor 1 | `doctor1` | `doctor123` | Agenda y citas del doctor |
| Doctor 2 | `doctor2` | `doctor123` | Disponibilidad alternativa |
| Paciente 1 | `juan` | `patient123` | Reserva de citas |
| Paciente 2 | `ana` | `patient123` | Historial de citas |

---

## 🧑‍💼 Pruebas - ROL ADMINISTRADOR

### Panel de Control
- [ ] Verifica que veas 5 usuarios en total
- [ ] Verifica que veas 2 doctores
- [ ] Verifica que veas 2 pacientes
- [ ] Verifica que veas 2 citas creadas por defecto

### Gestión de Usuarios
**Pasos:**
1. Click en "Usuarios" (navbar)
2. Verifica que aparezcan los 5 usuarios
3. Click en "Agregar Usuario"

**Crear nuevo usuario:**
- Username: `test_doctor`
- Contraseña: `test123456`
- Nombre: `Dr. Prueba`
- Email: `test@hospital.com`
- Rol: "Doctor"
- Click "Crear Usuario"
- [ ] Verifica que aparezca la confirmación

**Editar usuario (placeholder):**
- Click en "Editar" de cualquier usuario
- [ ] Debería mostrar mensaje de desarrollo

**Eliminar usuario:**
- Click en "Eliminar"
- Confirma la acción
- [ ] El usuario debe desaparecer de la lista

### Gestión de Citas
**Pasos:**
1. Click en "Citas" (navbar)
2. Deberías ver 2 citas por defecto

**Ver detalles:**
- Click en botón "Ver" de cualquier cita
- [ ] Aparece modal con detalles

**Cancelar cita:**
- Si la cita está "Programada", aparece botón "Cancelar"
- Click "Cancelar" → Confirma
- [ ] El estado cambia a "Cancelada"

---

## 🏥 Pruebas - ROL DOCTOR

### Acceder
- Usuario: `doctor1`
- Contraseña: `doctor123`

### Dashboard
- [ ] Deberías ver "Citas Programadas: 0"
- [ ] Deberías ver "Citas Completadas: 0"
- [ ] Deberías ver "Total de Citas: 1"
- [ ] En "Próximas Citas" aparece la cita con el paciente "Juan Pérez"

### Mi Agenda
**Pasos:**
1. Click en "Mi Agenda" (navbar)
2. Deberías ver 7 filas (uno por día)

**Modificar disponibilidad:**
- Lunes: `09:00` a `17:00` ✅ (ya tiene)
- Miércoles: Cambiar de `09:00-17:00` a `10:00-16:00`
- Sábado: Agregar `09:00` a `13:00`
- Click "Guardar Agenda"
- [ ] Aparece "Agenda actualizada correctamente"
- [ ] Recarga y verifica que los cambios persisten

### Mis Citas
**Pasos:**
1. Click en "Mis Citas" (navbar)
2. Deberías ver tab "Programadas (1)"

**Ver cita:**
- Deberías ver tabla con cita del paciente Juan Pérez

**Completar cita:**
- Click botón "✓ Completar"
- Ingresa notas: "Paciente en buen estado"
- [ ] Alerta de éxito aparece
- [ ] La cita se mueve a tab "Completadas"

**Cancelar cita:**
- Crear otra cita primero (como paciente)
- Volver a Doctor
- Click "✕ Cancelar"
- [ ] Confirma y se marca como cancelada

---

## 👨‍⚕️ Pruebas - ROL PACIENTE

### Acceder
- Usuario: `juan`
- Contraseña: `patient123`

### Dashboard
- [ ] Deberías ver nombre "Juan Pérez"
- [ ] Deberías ver citas programadas
- [ ] Deberías ver tus próximas citas

### Agendar Nueva Cita
**Pasos:**
1. Click en "Agendar Cita" (navbar)
2. Deberías ver formulario

**Llenar formulario:**
1. **Seleccionar Doctor:** `Dr. Carlos Rodríguez` (doctor1)
2. **Seleccionar Fecha:** Elige una fecha futura (mínimo hoy)
   - [ ] Solo fechas futuras están disponibles
3. **Seleccionar Hora:** Elige una hora disponible
   - [ ] Deberías ver slots de 30 minutos
   - [ ] Si no hay slots, intenta otro doctor o fecha
4. **Motivo:** "Revisar resultados de exámenes"
5. Click "Agendar Cita"
- [ ] Alerta de éxito con fecha y hora formateada
- [ ] Se redirige a "Mis Citas"

### Mis Citas
**Pasos:**
1. Click en "Mis Citas" (navbar)
2. Tab "Programadas" muestra tus citas agendadas

**Validar información:**
- [ ] Aparece doctor correcto
- [ ] Aparece fecha y hora correctas
- [ ] Estado es "Programada"

**Validar historial:**
- Tab "Completadas" - muestra citas del doctor
- Tab "Canceladas" - si hay canceladas

**Cancelar cita:**
- Click "✕ Cancelar"
- [ ] Confirma la acción
- [ ] Se mueve a "Canceladas"

---

## 🔐 Pruebas - AUTENTICACIÓN

### Login con credenciales correctas
- Usa: `admin` / `admin123`
- [ ] Login exitoso
- [ ] Redirección al dashboard

### Login con credenciales incorrectas
- Usa: `admin` / `wrongpassword`
- [ ] Error: "Usuario o contraseña incorrectos"

### Login con usuario inexistente
- Usa: `noexiste` / `pass123`
- [ ] Error: "Usuario o contraseña incorrectos"

### Logout
- Click en "Salir" (navbar derecha)
- [ ] Regresa a pantalla de login
- [ ] Sessions se limpian

### Protección de vistas
1. Loguéate como paciente (`juan`)
2. Abre consola (F12)
3. Ejecuta: `sessionStorage.clear()`
4. Recarga página
- [ ] Regresa a login (no puede ver dashboard sin sesión)

---

## 💾 Pruebas - PERSISTENCIA

### localStorage funciona
1. Loguéate como admin
2. Crea un nuevo usuario (ejemplo: `test_user` / `test123456`)
3. Cierra el navegador **completamente**
4. Reabre y ve a la app
5. Loguéate con el nuevo usuario
- [ ] El usuario persiste (está en localStorage)

### Limpiar datos
1. Abre consola (F12)
2. Ejecuta: `localStorage.clear()`
3. Ejecuta: `location.reload()`
- [ ] Los datos de prueba se cargan nuevamente

---

## 🎨 Pruebas - INTERFAZ

### Responsive Design
- [ ] Abre la app en Desktop (1920px)
- [ ] Redimensiona a Tablet (768px)
- [ ] Redimensiona a Móvil (375px)
- [ ] Todos los elementos se ven bien

### Botones y Formularios
- [ ] Los botones tienen efectos hover
- [ ] Los botones disabled no se pueden usar
- [ ] Validaciones muestran errores en rojo
- [ ] Campos requeridos están marcados

### Colores y Badges
- [ ] Badge "Programada" = azul
- [ ] Badge "Completada" = verde
- [ ] Badge "Cancelada" = rojo

---

## 🔄 Flujo Completo (Escenario Real)

1. **Admin crea un doctor nuevo**
   - Loguéate como admin
   - Crea nuevo usuario (doctor)
   - Guarda las credenciales

2. **Doctor configura su agenda**
   - Loguéate con el nuevo doctor
   - Ve a "Mi Agenda"
   - Configura disponibilidad (ej: Lunes-Viernes 9AM-5PM)
   - Guarda agenda

3. **Paciente se registra** (si es necesario)
   - Admin crea nuevo paciente
   - Paciente se loguea

4. **Paciente agenda cita**
   - Loguéate como paciente
   - Ve a "Agendar Cita"
   - Selecciona el doctor nuevo
   - Selecciona fecha y hora disponible
   - Agenda cita

5. **Doctor ve la cita**
   - Loguéate como doctor
   - Ve "Mis Citas" → "Programadas"
   - Verifica que aparezca la cita del paciente

6. **Doctor completa la cita**
   - Click "✓ Completar"
   - Ingresa notas
   - Confirma

7. **Paciente ve cambio**
   - Loguéate como paciente
   - Ve "Mis Citas" → "Completadas"
   - Verifica que la cita aparezca ahí

8. **Admin ve estadísticas**
   - Loguéate como admin
   - Dashboard muestra +1 cita completada
   - Verifica estadísticas

---

## 🐛 Problemas Comunes

### "Las citas no se guardan después de cerrar el navegador"
**Solución:** Verifica que localStorage esté habilitado
```javascript
// En consola (F12):
console.log(localStorage.getItem('hospital_appointments'))
```

### "No puedo agendar cita - dice 'No hay horarios disponibles'"
**Causas posibles:**
- El doctor no configuró disponibilidad ese día
- El día es domingo (no hay citas)
- La fecha es en el pasado
- Todos los slots están reservados

### "Logout no funciona"
**Solución:** Limpia manualmente
```javascript
sessionStorage.clear();
location.reload();
```

### "Los estilos no se ven"
**Soluciones:**
- Verifica que Bootstrap 5 CDN cargue (F12 → Network)
- Verifica que `styles.css` exista
- Limpia caché del navegador (Ctrl+Shift+Del)

---

## 📊 Checklist Final

- [ ] Login/Logout funciona
- [ ] Admin puede crear usuarios
- [ ] Admin puede ver todas las citas
- [ ] Doctor puede configurar agenda
- [ ] Doctor puede ver sus citas
- [ ] Doctor puede completar citas
- [ ] Paciente puede agendar citas
- [ ] Paciente puede cancelar citas
- [ ] Datos persisten después de cerrar navegador
- [ ] Interfaz es responsive
- [ ] No hay errores en consola

---

**¡Si pasas todos estos tests, el sistema está funcionando correctamente! ✅**
