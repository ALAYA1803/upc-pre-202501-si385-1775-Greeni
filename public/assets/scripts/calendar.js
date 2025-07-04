document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTOS DEL DOM ---
    const calendarEl = document.getElementById('calendar-container');
    const modal = document.getElementById('event-modal');
    const addEventBtn = document.getElementById('add-event-btn');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const cancelEventBtn = document.getElementById('cancel-event-btn');
    const eventForm = document.getElementById('event-form');
    const selectedDayLabel = document.getElementById('selected-day-label');
    const dayEventsList = document.getElementById('day-events-list');

    // --- DATOS DE EJEMPLO ---
    const initialEvents = [
        { title: 'Regar Monstera', start: new Date(), allDay: true, classNames: ['event-riego'] },
        { title: 'Podar Rosal', start: new Date(new Date().setDate(new Date().getDate() + 2)), allDay: true, classNames: ['event-poda'] },
        { title: 'Fertilizar Suculentas', start: new Date(new Date().setDate(new Date().getDate() - 3)), allDay: true, classNames: ['event-fertilizacion'] }
    ];
    
    // --- INICIALIZACIÓN DE FULLCALENDAR ---
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        height: '100%', // El calendario ocupará la altura de su contenedor
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: initialEvents,
        editable: true,
        selectable: true,
        dateClick: function(info) {
            openModal(info.dateStr);
            updateDayEventsSidebar(info.date);
        },
        eventClick: function(info) {
            alert(`Tarea: ${info.event.title}`);
        },
        datesSet: function(dateInfo) {
            // Al cambiar de mes, actualizamos el sidebar con el primer día visible
            updateDayEventsSidebar(dateInfo.view.currentStart);
        }
    });

    calendar.render();

    // --- MANEJO DEL MODAL ---
    function openModal(date = null) {
        eventForm.reset();
        if (date) {
            document.getElementById('event-date').value = date;
        }
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    addEventBtn.addEventListener('click', () => openModal(new Date().toISOString().slice(0, 10)));
    closeModalBtn.addEventListener('click', closeModal);
    cancelEventBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    // --- MANEJO DEL FORMULARIO DE EVENTOS ---
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const type = document.getElementById('event-type').value;

        if (title && date) {
            calendar.addEvent({
                title: title,
                start: date,
                allDay: true,
                classNames: [`event-${type}`]
            });
            closeModal();
            updateDayEventsSidebar(new Date(date + 'T00:00:00')); // Asegurar que la fecha se interprete correctamente
        }
    });

    // --- ACTUALIZAR BARRA LATERAL CON EVENTOS DEL DÍA ---
    function updateDayEventsSidebar(date) {
        const day = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        selectedDayLabel.textContent = `Tareas para el ${day}`;
        
        const allEvents = calendar.getEvents();
        const eventsForDay = allEvents.filter(event => new Date(event.start).toDateString() === date.toDateString());

        dayEventsList.innerHTML = '';
        if (eventsForDay.length > 0) {
            eventsForDay.forEach(event => {
                const li = document.createElement('li');
                li.className = `day-event-item ${event.classNames[0] || 'event-otro'}`;
                
                let iconClass = 'fa-check';
                if (event.classNames.includes('event-riego')) iconClass = 'fa-tint';
                if (event.classNames.includes('event-poda')) iconClass = 'fa-cut';
                if (event.classNames.includes('event-fertilizacion')) iconClass = 'fa-leaf';

                li.innerHTML = `<i class="fas ${iconClass}"></i><span>${event.title}</span>`;
                dayEventsList.appendChild(li);
            });
        } else {
            dayEventsList.innerHTML = '<li>No hay tareas programadas para este día.</li>';
        }
    }
    
    // --- ASIGNAR COLORES A LOS EVENTOS ---
    const style = document.createElement('style');
    style.innerHTML = `
        .event-riego { background-color: var(--color-riego) !important; border-color: var(--color-riego) !important; }
        .event-poda { background-color: var(--color-poda) !important; border-color: var(--color-poda) !important; }
        .event-fertilizacion { background-color: var(--color-fertilizacion) !important; border-color: var(--color-fertilizacion) !important; }
        .event-otro { background-color: var(--color-otro) !important; border-color: var(--color-otro) !important; }
    `;
    document.head.appendChild(style);

    // --- INICIALIZAR LA BARRA LATERAL CON EL DÍA DE HOY ---
    updateDayEventsSidebar(new Date());
});