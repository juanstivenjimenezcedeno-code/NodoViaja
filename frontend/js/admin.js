const adminDarkPalette = {
    blue: '#1E90FF',
    deepBlue: '#0A5FD6',
    orange: '#FF8A00',
    yellow: '#FFC400',
    teal: '#00C9A7'
};

function colorWithAlpha(hex, alpha) {
    const value = hex.slice(1);
    const red = Number.parseInt(value.slice(0, 2), 16);
    const green = Number.parseInt(value.slice(2, 4), 16);
    const blue = Number.parseInt(value.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function darkenAdminClass(token) {
    if (token === 'bg-white') return 'bg-slate-700';
    if (token.startsWith('bg-white/')) return token.replace('bg-white', 'bg-slate-700');
    if (/^(from|via|to)-white$/.test(token)) return token.replace('-white', '-slate-800');

    return token.replace(
        /(^|:)(placeholder:text|bg|text|border|from|via|to|shadow|ring|outline|divide)-(slate|sky|teal|amber|orange|blue)-(\d{2,3})(\/[\w.]+)?(?=$|:)/g,
        (match, modifier, utility, color, shadeText, opacity = '') => {
            const shade = Number(shadeText);
            let replacement;

            if (color === 'sky' || color === 'blue') color = 'slate';

            if (color === 'slate') {
                const shades = {
                    bg: { 50: 800, 100: 800, 200: 700, 300: 700, 400: 600, 500: 500, 600: 400, 700: 300, 800: 200, 900: 100, 950: 50 },
                    text: { 50: 300, 100: 300, 200: 200, 300: 200, 400: 300, 500: 400, 600: 300, 700: 200, 800: 100, 900: 100 },
                    border: { 50: 800, 100: 800, 200: 700, 300: 600, 400: 600, 500: 500, 600: 400, 700: 300, 800: 200, 900: 300 },
                    gradient: { 50: 800, 100: 800, 200: 700, 300: 700, 400: 600, 500: 500, 600: 400, 700: 300, 800: 200, 900: 100, 950: 50 }
                };
                const category = utility === 'bg' ? 'bg' : utility === 'text' ? 'text' : utility === 'border' ? 'border' : 'gradient';
                replacement = shades[category][shade] ?? shade;
                color = replacement === 950 ? 'slate' : 'slate';
            } else if (utility === 'text') {
                replacement = shade <= 500 ? 200 : shade <= 700 ? 300 : shade === 800 ? 200 : 100;
            } else if (utility === 'border' || utility === 'divide') {
                replacement = shade <= 100 ? 600 : shade <= 200 ? 600 : shade <= 300 ? 600 : shade <= 400 ? 500 : Math.max(300, shade - 200);
            } else if (utility === 'bg') {
                if (shade <= 300) {
                    replacement = 700;
                    color = 'slate';
                    opacity = '/70';
                } else if (shade <= 500) {
                    replacement = shade + 200;
                } else if (shade <= 700) {
                    replacement = 600;
                } else {
                    replacement = Math.max(300, shade - 300);
                }
            } else if (utility === 'shadow') {
                replacement = 950;
                opacity = opacity || '/20';
                color = 'slate';
            } else {
                if (shade <= 200) {
                    replacement = 900;
                    color = 'slate';
                } else {
                    replacement = Math.max(300, shade - 300);
                }
            }

            return `${modifier}${utility}-${color}-${replacement}${opacity}`;
        }
    );
}

function applyAdminThemeToElement(element, theme, updateLightClasses = false) {
    if (!element.dataset.adminLightClasses) {
        element.dataset.adminLightClasses = element.className;
    }
    if (updateLightClasses) element.dataset.adminLightClasses = element.className;
    const lightClasses = element.dataset.adminLightClasses;
    element.className = theme === 'dark'
        ? lightClasses.split(/\s+/).map(darkenAdminClass).join(' ')
        : lightClasses;
    if (element === document.body) {
        if (theme === 'dark') {
            element.style.setProperty('background-image', 'linear-gradient(135deg, #172433 0%, #202f40 52%, #172433 100%)', 'important');
        } else {
            element.style.removeProperty('background-image');
        }
    }
    if (element.tagName === 'ASIDE') {
        if (theme === 'dark') {
            element.style.setProperty('background-color', '#142231', 'important');
            element.style.setProperty('border-color', colorWithAlpha(adminDarkPalette.blue, 0.25), 'important');
        } else {
            element.style.removeProperty('background-color');
            element.style.removeProperty('border-color');
        }
    }
    if (element.dataset.darkSurface) {
        const darkSurfaces = {
            amber: { background: '#382f24', accent: adminDarkPalette.orange },
            teal: { background: '#183638', accent: adminDarkPalette.teal },
            sky: { background: '#1d3448', accent: adminDarkPalette.blue },
            orange: { background: '#3a3125', accent: adminDarkPalette.yellow }
        };
        const surface = darkSurfaces[element.dataset.darkSurface];
        if (theme === 'dark' && surface) {
            element.style.setProperty('background-color', surface.background, 'important');
            element.style.setProperty('border-color', colorWithAlpha(surface.accent, 0.45), 'important');
        } else {
            element.style.removeProperty('background-color');
            element.style.removeProperty('border-color');
        }
    }
    if (element !== document.body && element.tagName !== 'ASIDE' && !element.dataset.darkSurface && /\bbg-(?:sky|blue|slate|teal|amber|orange)-(?:50|100|200)(?:\/[\w.]+)?\b/.test(lightClasses)) {
        const accent = /bg-(?:sky|blue)-/.test(lightClasses)
            ? adminDarkPalette.blue
            : /bg-teal-/.test(lightClasses)
                ? adminDarkPalette.teal
                : /bg-orange-/.test(lightClasses)
                    ? adminDarkPalette.orange
                    : /bg-amber-/.test(lightClasses)
                        ? adminDarkPalette.yellow
                        : adminDarkPalette.deepBlue;
        if (theme === 'dark') {
            element.style.setProperty('background-color', colorWithAlpha(accent, 0.16), 'important');
        } else {
            element.style.removeProperty('background-color');
        }
    }
    if (lightClasses.includes('from-sky-50/80')) {
        if (theme === 'dark') {
            element.style.setProperty('background-image', `linear-gradient(110deg, ${colorWithAlpha(adminDarkPalette.deepBlue, 0.2)} 0%, #202f40 58%, ${colorWithAlpha(adminDarkPalette.orange, 0.12)} 100%)`, 'important');
        } else {
            element.style.removeProperty('background-image');
        }
    }
    const actionButton = /\bbg-teal-700\b/.test(lightClasses);
    if (actionButton) {
        if (theme === 'dark') {
            element.style.setProperty('background-color', adminDarkPalette.teal, 'important');
        } else {
            element.style.removeProperty('background-color');
        }
    }
    if (element.classList.contains('menu-item')) {
        if (theme === 'dark' && element.getAttribute('aria-current') === 'page') {
            element.style.setProperty('background-color', colorWithAlpha(adminDarkPalette.deepBlue, 0.34), 'important');
            element.style.setProperty('color', '#C8E2FF', 'important');
        } else {
            element.style.removeProperty('background-color');
            element.style.removeProperty('color');
        }
    }
}

function applyAdminTheme(theme) {
    document.body.dataset.theme = theme;
    document.querySelectorAll('[class]').forEach(element => applyAdminThemeToElement(element, theme));

    const toggle = document.getElementById('theme-toggle');
    const label = document.getElementById('theme-label');
    const icon = document.getElementById('theme-icon');
    const isDark = theme === 'dark';

    if (toggle) {
        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.setAttribute('aria-label', `Activar modo ${isDark ? 'claro' : 'oscuro'}`);
        if (label) label.textContent = `Modo ${isDark ? 'claro' : 'oscuro'}`;
        if (icon) icon.textContent = isDark ? '☀' : '☾';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            applyAdminTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
        });
    }
    applyAdminTheme(document.body.dataset.theme || 'light');

    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');

    function activateSection(id) {
        sections.forEach(section => {
            section.className = section.dataset.adminLightClasses || section.className;
            section.classList.add('hidden');
            applyAdminThemeToElement(section, document.body.dataset.theme, true);
        });
        const target = document.getElementById(id);
        if (target && target.classList.contains('section')) {
            target.className = target.dataset.adminLightClasses || target.className;
            target.classList.remove('hidden');
            applyAdminThemeToElement(target, document.body.dataset.theme, true);
        }

        menuItems.forEach(mi => {
            const isActive = mi.dataset.section === id;
            mi.className = mi.dataset.adminLightClasses || mi.className;
            mi.classList.toggle('bg-teal-50', isActive);
            mi.classList.toggle('text-teal-800', isActive);
            mi.classList.toggle('font-semibold', isActive);
            mi.classList.toggle('text-slate-600', !isActive);
            mi.classList.toggle('font-medium', !isActive);
            mi.setAttribute('aria-current', isActive ? 'page' : 'false');
            applyAdminThemeToElement(mi, document.body.dataset.theme, true);
        });

        const menu = Array.from(menuItems).find(mi => mi.dataset.section === id);
        if (menu && pageTitle) pageTitle.textContent = menu.querySelector('.menu-label')?.textContent || id;
        else if (target && pageTitle) {
            const h = target.querySelector('h2');
            if (h) pageTitle.textContent = h.textContent;
        }

        history.replaceState(null, '', `#${id}`);
    }

    menuItems.forEach(btn => {
        btn.addEventListener('click', () => activateSection(btn.dataset.section));
    });

    document.querySelectorAll('[data-open-section]').forEach(card => {
        const openCardSection = () => {
            activateSection(card.dataset.openSection);
            if (card.dataset.reservationFilter) mostrarReservas(card.dataset.reservationFilter);
        };
        card.addEventListener('click', openCardSection);
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCardSection();
            }
        });
    });

    window.mostrarSeccion = activateSection;

    // Reserva demo compartida entre el dashboard y las pestañas de gestión.
    const reservas = [
        { id: 'reserva-1', cliente: 'María López', servicio: 'Tour Río Magdalena', fecha: '15/09/2026', personas: 3, estado: 'pendiente' },
        { id: 'reserva-2', cliente: 'Carlos Pérez', servicio: 'Hotel El Parque', fecha: '18/09/2026', personas: 2, estado: 'aceptada' },
        { id: 'reserva-3', cliente: 'Laura Torres', servicio: 'Restaurante La Casona', fecha: '20/09/2026', personas: 4, estado: 'pendiente' }
    ];
    const reservasTabs = document.querySelectorAll('#reservas .tab');
    const tablaReservas = document.getElementById('tablaReservas');
    const tablaDashboard = document.getElementById('tablaDashboard');
    const reservasFeedback = document.getElementById('reservasFeedback');
    const reservationTotals = { pendiente: 8, aceptada: 24, rechazada: 0 };
    let estadoReservasActivo = 'pendiente';

    function renderizarFilaReserva(reserva) {
        const statusStyles = {
            pendiente: 'border-amber-200 bg-amber-50 text-amber-900',
            aceptada: 'border-teal-200 bg-teal-50 text-teal-900',
            rechazada: 'border-slate-200 bg-slate-100 text-slate-700'
        };
        const statusLabels = { pendiente: 'Pendiente', aceptada: 'Aceptada', rechazada: 'Rechazada' };
        const actions = reserva.estado === 'pendiente'
            ? `<button type="button" class="mr-1 size-8 rounded-md border border-teal-100 bg-teal-50/70 font-bold text-teal-800 transition-colors hover:bg-teal-100" data-reservation-action="aceptada" data-reservation-id="${reserva.id}" aria-label="Aceptar reserva de ${reserva.cliente}" title="Aceptar reserva">✓</button><button type="button" class="size-8 rounded-md border border-amber-100 bg-amber-50/70 font-bold text-amber-800 transition-colors hover:bg-amber-100" data-reservation-action="rechazada" data-reservation-id="${reserva.id}" aria-label="Rechazar reserva de ${reserva.cliente}" title="Rechazar reserva">✕</button>`
            : `<button type="button" class="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100" data-reservation-action="pendiente" data-reservation-id="${reserva.id}">Volver a pendientes</button>`;

        return `<tr>
            <td>${reserva.cliente}</td>
            <td>${reserva.servicio}</td>
            <td>${reserva.fecha}</td>
            <td>${reserva.personas}</td>
            <td><span class="rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[reserva.estado]}">${statusLabels[reserva.estado]}</span></td>
            <td>${actions}</td>
        </tr>`;
    }

    function mostrarReservas(estado = estadoReservasActivo) {
        estadoReservasActivo = estado;
        reservasTabs.forEach(tab => {
            const isActive = tab.dataset.status === estado;
            tab.className = tab.dataset.adminLightClasses || tab.className;
            tab.classList.toggle('border-teal-700', isActive);
            tab.classList.toggle('text-teal-800', isActive);
            tab.classList.toggle('font-semibold', isActive);
            tab.classList.toggle('border-transparent', !isActive);
            tab.classList.toggle('text-slate-500', !isActive);
            tab.classList.toggle('font-medium', !isActive);
            applyAdminThemeToElement(tab, document.body.dataset.theme, true);
            tab.setAttribute('aria-pressed', String(isActive));
        });

        const reservasFiltradas = reservas.filter(reserva => reserva.estado === estado);
        if (tablaReservas) {
            tablaReservas.innerHTML = reservasFiltradas.length
                ? reservasFiltradas.map(renderizarFilaReserva).join('')
                : `<tr><td colspan="6" class="py-8 text-center text-sm text-slate-500">No hay reservas ${estadoLabels[estado]}.</td></tr>`;
        }
        if (tablaDashboard) {
            const pendientes = reservas.filter(reserva => reserva.estado === 'pendiente');
            tablaDashboard.innerHTML = pendientes.length
                ? pendientes.map(renderizarFilaReserva).join('')
                : '<tr><td colspan="6" class="py-8 text-center text-sm text-slate-500">No hay reservas pendientes.</td></tr>';
        }
        [tablaReservas, tablaDashboard].forEach(tbody => {
            if (tbody) tbody.querySelectorAll('[class]').forEach(element => applyAdminThemeToElement(element, document.body.dataset.theme));
        });
    }

    const estadoLabels = { pendiente: 'pendientes', aceptada: 'aceptadas', rechazada: 'rechazadas' };
    [tablaReservas, tablaDashboard].forEach(tbody => {
        if (!tbody) return;
        tbody.addEventListener('click', event => {
            const button = event.target.closest('[data-reservation-action]');
            if (!button) return;
            const reserva = reservas.find(item => item.id === button.dataset.reservationId);
            if (!reserva) return;

            const nuevoEstado = button.dataset.reservationAction;
            reservationTotals[reserva.estado] = Math.max(0, reservationTotals[reserva.estado] - 1);
            reservationTotals[nuevoEstado] += 1;
            reserva.estado = nuevoEstado;
            mostrarReservas(estadoReservasActivo);
            const statPending = document.getElementById('statPendientes');
            const statAccepted = document.getElementById('statAceptadas');
            if (statPending) statPending.textContent = reservationTotals.pendiente;
            if (statAccepted) statAccepted.textContent = reservationTotals.aceptada;
            if (reservasFeedback) {
                const statusLabels = { pendiente: 'pendiente', aceptada: 'aceptada', rechazada: 'rechazada' };
                reservasFeedback.textContent = `Reserva de ${reserva.cliente} ${statusLabels[nuevoEstado]}.`;
            }
        });
    });

    window.mostrarReservas = mostrarReservas;
    if (document.getElementById('reservas')) mostrarReservas('pendiente');

    // Formulario servicios
    const formServicio = document.getElementById('formServicio');
    const servicioForm = document.getElementById('servicioForm');
    const servicesGrid = document.getElementById('servicesGrid');
    const serviceNameInput = document.getElementById('nombreServicio');
    const serviceDescriptionInput = document.getElementById('descripcionServicio');
    const servicePriceInput = document.getElementById('precioServicio');
    const serviceTypeInput = document.getElementById('tipoServicio');
    const serviceFeedback = document.getElementById('service-feedback');
    let editingServiceId = null;
    let serviceIdCounter = 0;
    let serviceCount = 12;
    const serviceAccents = {
        turismo: { border: 'border-teal-100', surface: 'bg-teal-50', label: 'text-teal-800' },
        hoteleria: { border: 'border-sky-100', surface: 'bg-sky-50', label: 'text-sky-800' },
        restaurante: { border: 'border-amber-100', surface: 'bg-amber-50', label: 'text-amber-900' }
    };

    function setServiceAccent(card, type) {
        const accent = serviceAccents[type] || serviceAccents.turismo;
        card.dataset.darkSurface = type === 'hoteleria' ? 'sky' : type === 'restaurante' ? 'amber' : 'teal';
        const baseCardClasses = card.dataset.adminLightClasses || card.className;
        card.className = baseCardClasses.replace(/\bborder-(?:slate|teal|sky|amber)-\d{2,3}\b/, accent.border);
        card.dataset.adminLightClasses = card.className;

        const surface = card.querySelector('[data-service-accent-surface]');
        const label = card.querySelector('[data-service-type]');
        if (surface) {
            const baseClasses = surface.dataset.adminLightClasses || surface.className;
            surface.className = baseClasses.replace(/\bbg-(?:teal|sky|amber|orange)-\d{2,3}\b/, accent.surface);
            surface.dataset.adminLightClasses = surface.className;
        }
        if (label) {
            const baseClasses = label.dataset.adminLightClasses || label.className;
            label.className = baseClasses.replace(/\btext-(?:teal|sky|amber|orange)-\d{3}\b/, accent.label);
            label.dataset.adminLightClasses = label.className;
        }

        applyAdminThemeToElement(card, document.body.dataset.theme, true);
        card.querySelectorAll('[class]').forEach(element => applyAdminThemeToElement(element, document.body.dataset.theme, true));
    }

    function refreshServiceCount() {
        const stat = document.getElementById('statServicios');
        if (stat) stat.textContent = serviceCount;
    }

    function setServiceAvailability(isAvailable) {
        document.querySelectorAll('[data-service-availability]').forEach(status => {
            status.textContent = isAvailable ? 'Publicado' : 'Oculto';
            status.classList.toggle('text-teal-700', isAvailable);
            status.classList.toggle('text-slate-500', !isAvailable);
            applyAdminThemeToElement(status, document.body.dataset.theme, true);
        });
    }

    function resetServiceForm() {
        if (!servicioForm) return;
        servicioForm.reset();
        editingServiceId = null;
        const title = formServicio?.querySelector('h2');
        const submit = document.getElementById('btn-guardar');
        if (title) title.textContent = 'Nuevo servicio';
        if (submit) submit.textContent = 'Guardar servicio';
    }

    window.mostrarFormularioServicio = () => {
        if (!formServicio) return;
        if (!editingServiceId) resetServiceForm();
        formServicio.className = formServicio.dataset.adminLightClasses || formServicio.className;
        formServicio.classList.remove('hidden');
        applyAdminThemeToElement(formServicio, document.body.dataset.theme, true);
        serviceNameInput?.focus();
    };
    window.ocultarFormularioServicio = () => {
        if (!formServicio) return;
        formServicio.className = formServicio.dataset.adminLightClasses || formServicio.className;
        formServicio.classList.add('hidden');
        applyAdminThemeToElement(formServicio, document.body.dataset.theme, true);
        resetServiceForm();
    };

    if (servicioForm) {
        servicioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!servicesGrid || !serviceNameInput || !serviceDescriptionInput || !servicePriceInput || !serviceTypeInput) return;
            const typeNames = { turismo: 'Turismo', hoteleria: 'Hotelería', restaurante: 'Restaurante' };
            const icons = { turismo: '🌳', hoteleria: '🏨', restaurante: '🍽️' };
            let card = editingServiceId ? servicesGrid.querySelector(`[data-service-id="${editingServiceId}"]`) : null;
            const isNew = !card;

            if (isNew) {
                card = document.createElement('article');
                card.className = 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm';
                card.dataset.serviceId = `service-new-${++serviceIdCounter}`;
                card.dataset.darkSurface = serviceTypeInput.value === 'hoteleria' ? 'sky' : serviceTypeInput.value === 'restaurante' ? 'amber' : 'teal';
                card.innerHTML = '<div class="flex h-36 items-center justify-center bg-teal-50 text-5xl" data-service-accent-surface data-service-icon></div><div class="p-5"><span class="text-xs font-bold text-teal-800" data-service-type></span><h3 class="my-2 font-bold text-slate-900" data-service-name></h3><p class="mb-4 text-sm leading-relaxed text-slate-600" data-service-description></p><strong class="text-slate-900" data-service-price></strong><p class="mt-2 text-xs font-medium text-teal-700" data-service-availability>Publicado</p><div class="mt-4 flex gap-2 border-t border-slate-100 pt-3"><button type="button" data-service-action="edit" class="rounded-lg border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-800 transition-colors hover:bg-sky-50">Editar</button><button type="button" data-service-action="delete" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50">Eliminar</button></div></div>';
                servicesGrid.prepend(card);
            }

            const category = typeNames[serviceTypeInput.value] || 'Servicio';
            const displayPrice = `$${Number(servicePriceInput.value).toLocaleString('es-CO')}`;
            const icon = card.querySelector('[data-service-icon], .flex.h-36');
            if (icon) icon.textContent = icons[serviceTypeInput.value] || '🏷️';
            const existingType = card.querySelector('[data-service-type]') || card.querySelector('.p-5 > span');
            const existingName = card.querySelector('[data-service-name]') || card.querySelector('.p-5 h3');
            const existingDescription = card.querySelector('[data-service-description]') || card.querySelector('.p-5 p');
            const existingPrice = card.querySelector('[data-service-price]') || card.querySelector('.p-5 strong');
            if (existingType) existingType.textContent = category;
            if (existingName) existingName.textContent = serviceNameInput.value.trim();
            if (existingDescription) existingDescription.textContent = serviceDescriptionInput.value.trim();
            if (existingPrice) existingPrice.textContent = displayPrice;
            if (isNew) {
                const availability = card.querySelector('[data-service-availability]');
                if (availability) availability.textContent = document.querySelector('[data-setting="availability"]')?.checked ? 'Publicado' : 'Oculto';
                serviceCount += 1;
            }
            setServiceAccent(card, serviceTypeInput.value);
            refreshServiceCount();
            if (serviceFeedback) serviceFeedback.textContent = `Servicio ${isNew ? 'añadido' : 'actualizado'} correctamente.`;
            window.ocultarFormularioServicio();
        });
    }

    if (servicesGrid) {
        servicesGrid.addEventListener('click', event => {
            const button = event.target.closest('[data-service-action]');
            if (!button) return;
            const card = button.closest('[data-service-id]');
            if (!card) return;
            if (button.dataset.serviceAction === 'delete') {
                if (!window.confirm(`¿Eliminar el servicio "${card.querySelector('h3')?.textContent || 'Servicio'}"?`)) return;
                card.remove();
                serviceCount = Math.max(0, serviceCount - 1);
                refreshServiceCount();
                return;
            }

            editingServiceId = card.dataset.serviceId;
            const currentType = (card.querySelector('[data-service-type]')?.textContent || card.querySelector('.p-5 > span')?.textContent || '').trim();
            const typeValues = { Turismo: 'turismo', Hotelería: 'hoteleria', Restaurante: 'restaurante' };
            if (serviceNameInput) serviceNameInput.value = card.querySelector('[data-service-name]')?.textContent || card.querySelector('.p-5 h3')?.textContent || '';
            if (serviceDescriptionInput) serviceDescriptionInput.value = card.querySelector('[data-service-description]')?.textContent || card.querySelector('.p-5 p')?.textContent || '';
            const priceText = card.querySelector('[data-service-price]')?.textContent || card.querySelector('.p-5 strong')?.textContent || '';
            if (servicePriceInput) servicePriceInput.value = priceText.replace(/[^\d]/g, '');
            if (serviceTypeInput) serviceTypeInput.value = typeValues[currentType] || '';
            const title = formServicio?.querySelector('h2');
            const submit = document.getElementById('btn-guardar');
            if (title) title.textContent = 'Editar servicio';
            if (submit) submit.textContent = 'Actualizar servicio';
            window.mostrarFormularioServicio();
        });
    }

    const messageForms = document.querySelectorAll('.message-reply-form');
    messageForms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const textarea = form.querySelector('textarea');
            const messageCard = form.closest('[data-message]');
            if (!textarea || !messageCard) return;
            const reply = document.createElement('p');
            reply.className = 'mt-3 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900';
            reply.textContent = `Tu respuesta: ${textarea.value.trim()}`;
            messageCard.querySelector('[data-sent-reply]')?.remove();
            reply.dataset.sentReply = '';
            const details = messageCard.querySelector('details');
            if (!details) return;
            details.after(reply);
            applyAdminThemeToElement(reply, document.body.dataset.theme);
            form.reset();
            details.removeAttribute('open');
        });
    });

    const settings = document.querySelectorAll('.setting-toggle');
    settings.forEach(toggle => {
        const updateSetting = () => {
            const status = document.getElementById(`setting-status-${toggle.dataset.setting}`);
            if (status) status.textContent = toggle.checked ? 'Activado' : 'Desactivado';
            if (toggle.dataset.setting === 'availability') setServiceAvailability(toggle.checked);
        };
        toggle.addEventListener('change', updateSetting);
        updateSetting();
    });

    const exportReportButton = document.getElementById('export-report');
    if (exportReportButton) {
        exportReportButton.addEventListener('click', () => {
            const reportRows = [
                ['Indicador', 'Valor'],
                ['Reservas este mes', document.getElementById('report-bookings')?.textContent || ''],
                ['Ingresos estimados', document.getElementById('report-revenue')?.textContent || ''],
                ['Clientes atendidos', document.getElementById('report-clients')?.textContent || ''],
                ['Calificación promedio', document.getElementById('report-rating')?.textContent || ''],
                ['Reservas pendientes', document.getElementById('statPendientes')?.textContent || ''],
                ['Reservas aceptadas', document.getElementById('statAceptadas')?.textContent || ''],
                ['Servicios ofrecidos', document.getElementById('statServicios')?.textContent || '']
            ];
            const csv = reportRows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
            const file = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'reporte-nodoviaja.csv';
            document.body.append(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            const feedback = document.getElementById('report-feedback');
            if (feedback) feedback.textContent = 'Descarga del reporte iniciada.';
        });
    }

    // Activar sección desde hash si existe
    const hash = location.hash.replace('#', '');
    if (hash) activateSection(hash);
});
