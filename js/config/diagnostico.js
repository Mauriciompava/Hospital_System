/**
 * ARCHIVO DE DIAGNÓSTICO Y DEBUG
 * Verifica que todos los módulos se hayan cargado correctamente
 * Abre la consola (F12) para ver el reporte de carga
 */

console.log('═══════════════════════════════════════════════════');
console.log('🏥 DIAGNÓSTICO DEL SISTEMA DE GESTIÓN HOSPITALARIA');
console.log('═══════════════════════════════════════════════════\n');

// Verificar localStorage disponible
console.log('📦 ALMACENAMIENTO:');
if (typeof Storage !== 'undefined') {
    console.log('✅ localStorage disponible');
    console.log('✅ sessionStorage disponible');
} else {
    console.error('❌ localStorage no disponible');
}

// Verificar módulos de configuración
console.log('\n⚙️  CONFIGURACIÓN:');
if (typeof CONFIG !== 'undefined') {
    console.log('✅ config.js cargado');
    console.log(`   App: ${CONFIG.APP_NAME} v${CONFIG.APP_VERSION}`);
} else {
    console.error('❌ config.js no cargado');
}

// Verificar servicios de almacenamiento
console.log('\n💾 SERVICIOS DE ALMACENAMIENTO:');
if (typeof StorageService !== 'undefined') {
    console.log('✅ StorageService cargado');
}
if (typeof storage !== 'undefined') {
    console.log('✅ Instancia storage disponible');
} else {
    console.error('❌ storage no disponible');
}

// Verificar servicios de autenticación
console.log('\n🔐 SERVICIOS DE AUTENTICACIÓN:');
if (typeof AuthService !== 'undefined') {
    console.log('✅ AuthService cargado');
}
if (typeof auth !== 'undefined') {
    console.log('✅ Instancia auth disponible');
} else {
    console.error('❌ auth no disponible');
}

// Verificar servicios de usuarios
console.log('\n👥 SERVICIOS DE USUARIOS:');
if (typeof UserService !== 'undefined') {
    console.log('✅ UserService cargado');
}
if (typeof userService !== 'undefined') {
    console.log('✅ Instancia userService disponible');
} else {
    console.error('❌ userService no disponible');
}

// Verificar servicios de citas
console.log('\n📅 SERVICIOS DE CITAS:');
if (typeof AppointmentService !== 'undefined') {
    console.log('✅ AppointmentService cargado');
}
if (typeof appointmentService !== 'undefined') {
    console.log('✅ Instancia appointmentService disponible');
} else {
    console.error('❌ appointmentService no disponible');
}

// Verificar servicios de doctores
console.log('\n🏥 SERVICIOS DE DOCTORES:');
if (typeof DoctorService !== 'undefined') {
    console.log('✅ DoctorService cargado');
}
if (typeof doctorService !== 'undefined') {
    console.log('✅ Instancia doctorService disponible');
} else {
    console.error('❌ doctorService no disponible');
}

// Verificar controladores
console.log('\n🎮 CONTROLADORES:');
const controllers = ['AuthController', 'AdminController', 'DoctorController', 'PatientController'];
controllers.forEach(ctrl => {
    if (typeof window[ctrl] !== 'undefined') {
        console.log(`✅ ${ctrl} cargado`);
    } else {
        console.error(`❌ ${ctrl} no cargado`);
    }
});

// Verificar utilidades
console.log('\n🔧 UTILIDADES:');
const utilities = [
    'showAlert',
    'formatDate',
    'formatDateTime',
    'getDayName',
    'getStatusBadge',
    'getDoctorName',
    'getPatientName',
    'isValidEmail',
    'handleLogout',
    'clearForm'
];
utilities.forEach(util => {
    if (typeof window[util] === 'function') {
        console.log(`✅ ${util} disponible`);
    } else if (typeof window[util] !== 'undefined') {
        console.log(`✅ ${util} disponible`);
    } else {
        console.error(`❌ ${util} no disponible`);
    }
});

// Verificar validadores
console.log('\n✔️  VALIDADORES:');
if (typeof Validator !== 'undefined') {
    console.log('✅ Clase Validator cargada');
}
if (typeof validate !== 'undefined') {
    console.log('✅ Instancia validate disponible');
    const methods = ['validateLogin', 'validateRegistration', 'validateAppointment', 'displayErrors'];
    methods.forEach(method => {
        if (typeof validate[method] === 'function') {
            console.log(`   ✅ validate.${method}() disponible`);
        }
    });
} else {
    console.error('❌ validate no disponible');
}

// Verificar ViewLoader
console.log('\n📄 CARGADOR DE VISTAS:');
if (typeof ViewLoader !== 'undefined') {
    console.log('✅ ViewLoader cargado');
    const methods = ['loadView', 'renderView', 'renderWithData'];
    methods.forEach(method => {
        if (typeof ViewLoader[method] === 'function') {
            console.log(`   ✅ ViewLoader.${method}() disponible`);
        }
    });
} else {
    console.error('❌ ViewLoader no cargado');
}

// Verificar Bootstrap
console.log('\n🎨 FRAMEWORKS:');
if (typeof bootstrap !== 'undefined') {
    console.log('✅ Bootstrap 5 cargado');
} else {
    console.error('❌ Bootstrap no cargado');
}

// Estado de datos
console.log('\n📊 ESTADO DE DATOS:');
try {
    const users = storage.getCollection('users');
    const appointments = storage.getCollection('appointments');
    const availability = storage.getCollection('doctor_availability');

    console.log(`✅ Usuarios: ${users.length} registrados`);
    console.log(`✅ Citas: ${appointments.length} registradas`);
    console.log(`✅ Disponibilidades: ${availability.length} configuradas`);
} catch (e) {
    console.error('⚠️  No se pudieron cargar los datos:', e.message);
}

// Usuario actual
console.log('\n🔐 SESIÓN ACTUAL:');
if (auth && auth.isAuthenticated()) {
    const user = auth.getCurrentUser();
    console.log(`✅ Usuario conectado: ${user.name}`);
    console.log(`   Rol: ${user.role}`);
} else {
    console.log('ℹ️  Sin usuario conectado (pantalla de login)');
}

// Resumen
console.log('\n═══════════════════════════════════════════════════');
console.log('✅ DIAGNÓSTICO COMPLETADO');
console.log('═══════════════════════════════════════════════════\n');

// Información de soporte
console.log('💡 INFORMACIÓN:');
console.log('• Para limpiar datos: localStorage.clear()');
console.log('• Ver usuarios: storage.getCollection("users")');
console.log('• Ver citas: storage.getCollection("appointments")');
console.log('• Usuario actual: auth.getCurrentUser()');
console.log('• Logout: handleLogout()');
console.log('\n');
