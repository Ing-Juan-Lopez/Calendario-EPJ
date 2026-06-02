document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendar-container');
    const modal = document.getElementById('event-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalDate = document.getElementById('modal-date');
    const modalEventsList = document.getElementById('modal-events-list');

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Configuración: De Junio 2026 (mes 5, basado en 0) a Diciembre 2026 (mes 11)
    const year = 2026;
    const startMonth = 5; // Junio
    const endMonth = 11; // Diciembre

    const getEmoji = (tipo) => {
        if (typeof emojisPorTipo !== 'undefined') {
            return emojisPorTipo[tipo] || emojisPorTipo['default'] || '📅';
        }
        return '📅';
    };

    // Cerrar modal
    const closeModal = () => {
        modal.classList.remove('show');
    };
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Función auxiliar para obtener el nombre del mes
    const getMonthName = (monthIndex) => {
        const date = new Date(year, monthIndex, 1);
        return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    };

    // Generar el calendario
    for (let currentMonth = startMonth; currentMonth <= endMonth; currentMonth++) {
        const monthSection = document.createElement('section');
        monthSection.className = 'month-section';

        const monthTitle = document.createElement('h2');
        monthTitle.className = 'month-title';
        monthTitle.textContent = getMonthName(currentMonth);
        monthSection.appendChild(monthTitle);

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        // Añadir nombres de los días
        dayNames.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'day-name';
            dayEl.textContent = day;
            grid.appendChild(dayEl);
        });

        // Obtener datos del mes
        const firstDay = new Date(year, currentMonth, 1).getDay();
        const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();

        // Rellenar días vacíos al principio
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            grid.appendChild(emptyCell);
        }

        // Rellenar días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            const dayNum = document.createElement('div');
            dayNum.className = 'day-number';
            dayNum.textContent = day;
            dayCell.appendChild(dayNum);

            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'events-container';

            // Formatear la fecha actual iterada como "YYYY-MM-DD" para buscar eventos
            const monthStr = String(currentMonth + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const currentDateStr = `${year}-${monthStr}-${dayStr}`;

            // Filtrar eventos para este día
            const dayEvents = typeof eventosDelCalendario !== 'undefined' 
                ? eventosDelCalendario.filter(e => e.fecha === currentDateStr)
                : [];
            
            dayEvents.forEach(evento => {
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'event-emoji';
                // Si el evento tiene su propio emoji definido en eventos.js lo usa, si no, usa el del tipo
                emojiSpan.textContent = evento.emoji || getEmoji(evento.tipo);
                eventsContainer.appendChild(emojiSpan);
            });

            dayCell.appendChild(eventsContainer);

            // Añadir interactividad si hay eventos
            if (dayEvents.length > 0) {
                dayCell.classList.add('has-events');
                dayCell.addEventListener('click', () => {
                    // Formatear la fecha para el título del modal
                    const dateObj = new Date(year, currentMonth, day);
                    const formattedDate = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    // Poner mayúscula la primera letra
                    modalDate.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
                    
                    // Llenar la lista
                    modalEventsList.innerHTML = '';
                    dayEvents.forEach(evento => {
                        const item = document.createElement('div');
                        item.className = 'modal-event-item';
                        
                        const emoji = document.createElement('div');
                        emoji.className = 'modal-event-emoji';
                        emoji.textContent = evento.emoji || getEmoji(evento.tipo);
                        
                        const title = document.createElement('div');
                        title.className = 'modal-event-title';
                        title.textContent = evento.titulo;
                        
                        item.appendChild(emoji);
                        item.appendChild(title);
                        modalEventsList.appendChild(item);
                    });
                    
                    modal.classList.add('show');
                });
            }

            grid.appendChild(dayCell);
        }

        monthSection.appendChild(grid);
        calendarContainer.appendChild(monthSection);
    }
});
