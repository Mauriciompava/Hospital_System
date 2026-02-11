# 🔧 GUÍA DE SOLUCIÓN DE PROBLEMAS

## Errores MIME Type y Carga de Recursos

Este documento aborda los errores más comunes y sus soluciones.

---

## ❌ Errores Comunes

### 1. **Error: 404 (Not Found) - Archivos no encontrados**

**Síntomas:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
- config.js
- helpers.js
- validators.js  
- ViewLoader.js
```

**Causa:**
Los archivos no existen en el directorio especificado o el `index.html` está en una ubicación incorrecta.

**Solución:**

✅ **Verificar estructura de carpetas:**
```
hospital-system/
├── index.html
├── js/
│   ├── config/
│   │   ├── config.js
│   │   ├── ViewLoader.js
│   │   └── diagnostico.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── services/
│   │   ├── StorageService.js
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── AppointmentService.js
│   │   └── DoctorService.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── AdminController.js
│   │   ├── DoctorController.js
│   │   └── PatientController.js
│   ├── models/
│   │   ├── DataModels.js
│   │   └── InitializeData.js
│   └── app.js
└── assets/
    └── css/
        └── styles.css
```

✅ **Verificar en consola del navegador (F12):**
```javascript
// Ver estructura de archivos
console.log('Archivos cargados:');
console.log(typeof ConfigConfig !== 'undefined' ? '✅ config.js' : '❌ config.js');
console.log(typeof StorageService !== 'undefined' ? '✅ StorageService' : '❌ StorageService');
```

---

### 2. **Error MIME Type (text/html is not executable)**

**Síntomas:**
```
Refused to execute script from 'http://127.0.0.1:5500/js/config/config.js'
because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.
```

**Causa:**
El servidor responde con HTML (error 404) pero el navegador espera JavaScript. Esto ocurre cuando:
- El archivo no existe en la ruta especificada
- El servidor está devolviendo una página de error HTML
- Los directorios no fueron creados correctamente

**Solución:**

✅ **Usar un servidor local en lugar de `file://`:**

```bash
# Opción 1: Python 3
python -m http.server 8000

# Opción 2: Node.js
npx http-server

# Opción 3: Live Server (VS Code extension)
# Clic derecho en index.html → "Open with Live Server"
```

**Accede a:** `http://localhost:8000/`

✅ **Verificar que VS Code esté aprovechando los servidores:**
1. **F12** para abrir Developer Tools
2. **Network tab** para ver las peticiones
3. Verifica que los archivos se cargen con status **200** (no 404)

---

### 3. **Error de Sesión o localStorage no disponible**

**Síntomas:**
```
Uncaught ReferenceError: storage is not defined
Uncaught ReferenceError: auth is not defined
```

**Causa:**
Los servicios no se cargaron porque:
- El orden de scripts en `index.html` es incorrecto
- Un script anterior tiene error y detiene la ejecución
- localStorage está deshabilitado en el navegador

**Solución:**

✅ **Verificar el orden correcto en `index.html`:**
```html
<!-- 1. Configuración primero -->
<script src="js/config/config.js"></script>

<!-- 2. Almacenamiento segundo -->
<script src="js/services/StorageService.js"></script>

<!-- 3. Utilidades -->
<script src="js/utils/helpers.js"></script>
<script src="js/utils/validators.js"></script>
<script src="js/config/ViewLoader.js"></script>

<!-- 4. Modelos -->
<script src="js/models/DataModels.js"></script>
<script src="js/models/InitializeData.js"></script>

<!-- 5. Servicios de aplicación -->
<script src="js/services/AuthService.js"></script>
<script src="js/services/UserService.js"></script>
<script src="js/services/AppointmentService.js"></script>
<script src="js/services/DoctorService.js"></script>

<!-- 6. Controladores -->
<script src="js/controllers/AuthController.js"></script>
<script src="js/controllers/AdminController.js"></script>
<script src="js/controllers/DoctorController.js"></script>
<script src="js/controllers/PatientController.js"></script>

<!-- 7. App -->
<script src="js/app.js"></script>

<!-- 8. Diagnóstico -->
<script src="js/config/diagnostico.js"></script>

<!-- 9. Bootstrap al final -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

✅ **Habilitar localStorage en navegador:**
- **Chrome:** Settings → Privacy → Content → Cookies and site data (debe estar activado)
- **Firefox:** about:config → dom.storage.enabled = true

---

### 4. **Error: "No data showing" o localStorage vacío**

**Síntomas:**
- Las tablas no muestran datos después de login
- localStorage aparece vacío

**Solución:**

✅ **Reinicializar datos:**
```javascript
// En consola (F12)
localStorage.clear();
location.reload();
```

✅ **Verificar que InitializeData se ejecute:**
```javascript
// En consola
console.log(storage.getCollection('users'));
```

Debería mostrar array con 5 usuarios.

---

### 5. **Error: Bootstrap no se carga o estilos rotos**

**Síntomas:**
- Botones no tienen estilo
- Modal no se ve corretamente
- Navbar no es responsivo

**Solución:**

✅ **Verificar CDN de Bootstrap en index.html:**
```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

<!-- JS (al final del body) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

✅ **Verificar custom CSS:**
```html
<!-- Después de Bootstrap, cargar custom CSS -->
<link rel="stylesheet" href="assets/css/styles.css">
```

---

## 🧪 Verificación Automática

Abre la **consola del navegador (F12)** y ejecuta:

```javascript
// Diagnóstico completo
console.log('=== DIAGNÓSTICO DEL SISTEMA ===\n');

// 1. Verificar localStorage
console.log('📦 localStorage disponible:', typeof Storage !== 'undefined' ? '✅' : '❌');

// 2. Verificar configuración
console.log('⚙️  CONFIG cargado:', typeof CONFIG !== 'undefined' ? '✅' : '❌');

// 3. Verificar servicios
console.log('💾 StorageService cargado:', typeof StorageService !== 'undefined' ? '✅' : '❌');
console.log('🔐 AuthService cargado:', typeof AuthService !== 'undefined' ? '✅' : '❌');
console.log('👥 UserService cargado:', typeof UserService !== 'undefined' ? '✅' : '❌');
console.log('📅 AppointmentService cargado:', typeof AppointmentService !== 'undefined' ? '✅' : '❌');

// 4. Verificar instancias
console.log('\n📍 Instancias globales:');
console.log('storage:', typeof storage !== 'undefined' ? '✅' : '❌');
console.log('auth:', typeof auth !== 'undefined' ? '✅' : '❌');
console.log('userService:', typeof userService !== 'undefined' ? '✅' : '❌');
console.log('appointmentService:', typeof appointmentService !== 'undefined' ? '✅' : '❌');
console.log('doctorService:', typeof doctorService !== 'undefined' ? '✅' : '❌');

// 5. Verificar datos
console.log('\n📊 Datos en localStorage:');
const users = storage.getCollection('users');
const appointments = storage.getCollection('appointments');
console.log(`Usuarios: ${users.length}`);
console.log(`Citas: ${appointments.length}`);

// 6. Verificar Bootstrap
console.log('\n🎨 Bootstrap:');
console.log('Bootstrap.Modal disponible:', typeof bootstrap !== 'undefined' ? '✅' : '❌');
```

---

## 🆘 Si Aún Tienes Problemas

### Opción 1: Recargar todo desde cero

```javascript
// 1. Limpiar datos
localStorage.clear();
sessionStorage.clear();

// 2. Limpiar caché del navegador
// Ctrl+Shift+Del (Windows) o Cmd+Shift+Del (Mac)
// Selecciona "Cookies and other site data" y "Cached images and files"

// 3. Recargar la página
location.reload();
```

### Opción 2: Modo desarrollo

Añade esto al inicio de `index.html` dentro de `<body>`:

```html
<div id="debug-info" style="position: fixed; bottom: 10px; right: 10px; background: #333; color: #0f0; padding: 10px; font-size: 12px; font-family: monospace; max-height: 200px; overflow-y: auto; z-index: 9999;">
    <div>Sistema: Cargando...</div>
    <div id="debug-status"></div>
</div>

<script>
// Debug en tiempo real
setTimeout(() => {
    const debug = document.getElementById('debug-status');
    const checks = {
        'localStorage': typeof Storage !== 'undefined',
        'CONFIG': typeof CONFIG !== 'undefined',
        'storage': typeof storage !== 'undefined',
        'auth': typeof auth !== 'undefined',
        'userService': typeof userService !== 'undefined',
        'Bootstrap': typeof bootstrap !== 'undefined'
    };
    
    Object.entries(checks).forEach(([key, val]) => {
        const div = document.createElement('div');
        div.textContent = `${val ? '✅' : '❌'} ${key}`;
        div.style.color = val ? '#0f0' : '#f00';
        debug.appendChild(div);
    });
}, 500);
</script>
```

---

## 📋 Checklist de Diagnóstico

- [ ] index.html está en la raíz del proyecto
- [ ] Carpetas existen: `js/config/`, `js/utils/`, `js/services/`, `js/controllers/`, etc.
- [ ] Se usa servidor local (no `file://`)
- [ ] Console (F12) no muestra errores de 404
- [ ] console.log(storage) retorna objeto
- [ ] console.log(auth) retorna objeto
- [ ] Bootstrap se carga sin errores
- [ ] localStorage tiene datos (`storage.getCollection('users')`)

---

## 🆘 Contacto y Soporte

Si los problemas persisten:

1. **Verifica la consola (F12)** - Busca mensajes de error rojos
2. **Ve a Network tab** - Revisa qué archivos tienen status 404
3. **Reinicia el servidor** - Detén y reinicia http-server
4. **Limpia caché** - Ctrl+Shift+R para hard refresh

---

**¡El sistema debería funcionar correctamente ahora!** 🎉
