document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a los elementos del DOM (sin cambios) ---
    const imageUploader = document.getElementById('image-uploader');
    const fileInput = document.getElementById('file-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsBody = document.getElementById('results-body');
    const humiditySlider = document.getElementById('humidity');
    const temperatureSlider = document.getElementById('temperature');
    const phSlider = document.getElementById('ph');
    const humidityValue = document.getElementById('humidity-value');
    const temperatureValue = document.getElementById('temperature-value');
    const phValue = document.getElementById('ph-value');

    // --- Lógica para subir imágenes (sin cambios) ---
    imageUploader.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            showImagePreview(file);
        }
    });
    imageUploader.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploader.classList.add('dragover');
    });
    imageUploader.addEventListener('dragleave', () => {
        imageUploader.classList.remove('dragover');
    });
    imageUploader.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploader.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            showImagePreview(file);
        }
    });

    function showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imageUploader.classList.add('hidden');
            imagePreviewContainer.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }

    removeImageBtn.addEventListener('click', () => {
        fileInput.value = ''; 
        imageUploader.classList.remove('hidden');
        imagePreviewContainer.classList.add('hidden');
        imagePreview.src = '#';
    });

    // =================================================================
    // ✨ NUEVA LÓGICA PROFESIONAL PARA LOS SLIDERS ✨
    // =================================================================

    /**
     * Función reutilizable para actualizar un slider y su valor,
     * y aplicar el efecto de relleno en la pista.
     * @param {HTMLInputElement} slider - El elemento input range.
     * @param {HTMLElement} valueDisplay - El elemento span que muestra el valor.
     * @param {string} unit - La unidad a mostrar (ej: '%', '°C', 'pH').
     */
    function updateSlider(slider, valueDisplay, unit = '') {
        if (!slider || !valueDisplay) return;

        // Función interna que calcula y aplica el fondo de relleno
        const applyFill = (el) => {
            const percentage = ((el.value - el.min) / (el.max - el.min)) * 100;
            // Usamos los colores de tu marca para consistencia
            const activeColor = '#005014'; // --verde-oscuro
            const inactiveColor = '#A5D6A7'; // --verde-pista
            el.style.background = `linear-gradient(to right, ${activeColor} ${percentage}%, ${inactiveColor} ${percentage}%)`;
        };

        // Listener que se activa cada vez que se mueve el slider
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            // Formato especial para pH para mostrar un decimal
            if (unit === 'pH') {
                valueDisplay.textContent = parseFloat(value).toFixed(1);
            } else {
                valueDisplay.textContent = `${value}${unit}`;
            }
            applyFill(e.target); // Aplicamos el relleno
        });

        // Llamada inicial para que los sliders se muestren correctamente al cargar la página
        applyFill(slider);
    }

    // Activamos la nueva función para cada uno de nuestros sliders
    updateSlider(humiditySlider, humidityValue, '%');
    updateSlider(temperatureSlider, temperatureValue, '°C');
    updateSlider(phSlider, phValue, 'pH');


    // --- Lógica del botón de análisis (sin cambios) ---
    analyzeBtn.addEventListener('click', () => {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando...';
        setTimeout(() => {
            displayResults();
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analizar de Nuevo';
        }, 2000);
    });

    function displayResults() {
        const resultData = {
            problem: 'Hongo (Oídio)',
            type: 'hongo',
            severity: 75, 
            recommendations: [
                { icon: 'fa-wind', text: 'Aumentar la ventilación alrededor de la planta.' },
                { icon: 'fa-tint-slash', text: 'Evitar mojar las hojas al regar.' },
                { icon: 'fa-spray-can', text: 'Aplicar un fungicida a base de azufre o neem.' }
            ]
        };

        resultsBody.innerHTML = `
            <div class="result-content">
                <h4>Problema Detectado</h4>
                <span class="result-tag ${resultData.type}">${resultData.problem}</span>

                <h4>Nivel de Severidad</h4>
                <div class="severity-bar">
                    <div class="severity-level" style="width: ${resultData.severity}%; background-color: ${resultData.severity > 60 ? '#EF4444' : '#F59E0B'}"></div>
                </div>

                <h4>Acciones Recomendadas</h4>
                <ul class="recommendation-list">
                    ${resultData.recommendations.map(rec => `
                        <li class="recommendation-item">
                            <i class="fas ${rec.icon}"></i>
                            <span>${rec.text}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
});