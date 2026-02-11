/**
 * CARGADOR DE VISTAS DINÁMICAS
 * Gestiona la carga y renderizado de vistas HTML
 * 
 * Este módulo proporciona funcionalidad para:
 * - Cargar archivos HTML remotos
 * - Renderizar vistas en contenedores
 * - Reemplazar variables en templates
 */

class ViewLoader {
    /**
     * Carga un archivo HTML de vista
     * @param {string} viewPath - Ruta de la vista (ej: 'views/admin/dashboard.html')
     * @returns {Promise<string>} Contenido HTML de la vista
     * @example const html = await ViewLoader.loadView('views/admin/users.html')
     */
    static async loadView(viewPath) {
        try {
            const response = await fetch(viewPath);
            if (!response.ok) {
                console.warn(`⚠️ Vista no encontrada: ${viewPath}`);
                throw new Error(`Error al cargar la vista: ${viewPath}`);
            }
            return await response.text();
        } catch (error) {
            console.error('❌ Error cargando vista:', error);
            return '';
        }
    }

    /**
     * Renderiza una vista HTML en un contenedor específico
     * @param {string} containerId - ID del contenedor donde renderizar
     * @param {string} viewPath - Ruta de la vista
     * @example await ViewLoader.renderView('app-container', 'views/auth/login.html')
     */
    static async renderView(containerId, viewPath) {
        const html = await this.loadView(viewPath);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
            console.log(`✓ Vista renderizada: ${viewPath}`);
        } else {
            console.error(`❌ Contenedor no encontrado: ${containerId}`);
        }
    }

    /**
     * Renderiza una vista con datos reemplazando variables
     * @param {string} template - HTML del template
     * @param {object} data - Objeto con datos para reemplazar
     * @returns {string} HTML renderizado con datos
     * @example 
     *  const html = ViewLoader.renderWithData(
     *    '<h1>Hola {{name}}</h1>',
     *    {name: 'Juan'}
     *  ) // → '<h1>Hola Juan</h1>'
     */
    static renderWithData(template, data) {
        let html = template;
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, data[key]);
        });
        return html;
    }

    /**
     * Carga múltiples vistas en paralelo
     * @param {array} viewPaths - Array de rutas de vistas
     * @returns {Promise<object>} Objeto con vistas cargadas
     * @example 
     *  const views = await ViewLoader.loadMultiple([
     *    'views/auth/login.html',
     *    'views/auth/register.html'
     *  ])
     */
    static async loadMultiple(viewPaths) {
        const promises = viewPaths.map(path =>
            this.loadView(path).then(html => ({ path, html }))
        );
        const results = await Promise.all(promises);

        const views = {};
        results.forEach(({ path, html }) => {
            views[path] = html;
        });
        return views;
    }

    /**
     * Renderiza un template dinámicamente
     * @param {string} html - HTML del template
     * @param {array} items - Array de objetos con datos
     * @param {string} itemTemplate - Template para cada item (con {{key}})
     * @returns {string} HTML renderizado con items
     */
    static renderList(html, items, itemTemplate) {
        const itemsHtml = items.map(item =>
            this.renderWithData(itemTemplate, item)
        ).join('');

        return html.replace('{{items}}', itemsHtml);
    }
}

console.log('✓ Módulo ViewLoader.js cargado');
