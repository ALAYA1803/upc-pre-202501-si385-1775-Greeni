document.addEventListener('DOMContentLoaded', () => {
  const navBar = document.querySelector('.nav-bar');
  if (navBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navBar.classList.add('scrolled');
      } else {
        navBar.classList.remove('scrolled');
      }
    });
  }
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle && menuToggle.checked) {
          menuToggle.checked = false;
        }
        
        const headerOffset = navBar ? navBar.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  //SECCIÓN DIAGNÓSTICO
  const modoManualBtn = document.getElementById('modoManualBtn');
  const modoFotoBtn = document.getElementById('modoFotoBtn');
  const inputsManual = document.getElementById('inputsManual');
  const inputsFoto = document.getElementById('inputsFoto');
  const uploadArea = document.querySelector('.upload-area');
  const fotoPlantaInput = document.getElementById('fotoPlanta');
  const imagePreview = document.getElementById('image-preview');

  if (modoManualBtn && modoFotoBtn) {
    modoManualBtn.addEventListener('click', () => {
      modoManualBtn.classList.add('active');
      modoFotoBtn.classList.remove('active');
      inputsManual.classList.remove('hidden');
      inputsFoto.classList.add('hidden');
    });

    modoFotoBtn.addEventListener('click', () => {
      modoFotoBtn.classList.add('active');
      modoManualBtn.classList.remove('active');
      inputsFoto.classList.remove('hidden');
      inputsManual.classList.add('hidden');
    });
  }
  if(uploadArea && fotoPlantaInput) {
    uploadArea.addEventListener('click', () => fotoPlantaInput.click());
    
    fotoPlantaInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadArea.classList.add('hidden');
                imagePreview.classList.remove('hidden');
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Vista previa de la planta" style="max-width: 100%; border-radius: 15px;">`;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });
  }

  function updateSlider(slider, valueDisplay, unit = '') {
    if (!slider || !valueDisplay) return;
    const applyFill = (el) => {
      const percentage = ((el.value - el.min) / (el.max - el.min)) * 100;
      const activeColor = '#005014';
      const inactiveColor = '#A5D6A7';
      el.style.background = `linear-gradient(to right, ${activeColor} ${percentage}%, ${inactiveColor} ${percentage}%)`;
    };
    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      valueDisplay.textContent = `${unit === 'pH' ? parseFloat(value).toFixed(1) : value}${unit === 'pH' ? '' : unit}`;
      applyFill(e.target);
    });
    applyFill(slider);
  }

  updateSlider(document.getElementById('temp'), document.getElementById('temp-value'), '°C');
  updateSlider(document.getElementById('humedad'), document.getElementById('humedad-value'), '%');
  updateSlider(document.getElementById('ph'), document.getElementById('ph-value'), 'pH');
  const analizarBtn = document.getElementById('analizarBtn');
  const tipoPlantaInput = document.getElementById('tipoPlanta');
  const mensajeAnalisis = document.getElementById('mensajeAnalisis');

  if(analizarBtn) {
    analizarBtn.addEventListener('click', () => {
        const modoManualActivo = modoManualBtn.classList.contains('active');
        const modoFotoActivo = modoFotoBtn.classList.contains('active');
        const esValidoManual = modoManualActivo && tipoPlantaInput.value.trim() !== '';
        const esValidoFoto = modoFotoActivo && fotoPlantaInput.files.length > 0;
        mensajeAnalisis.textContent = '';
        mensajeAnalisis.style.color = '#003D0F'; 

        if (esValidoManual || esValidoFoto) {
            mensajeAnalisis.textContent = 'Datos actualizados. Si quieres ver los resultados, descarga Greeni.';
        } else {
            if (modoManualActivo) {
                mensajeAnalisis.textContent = 'Error: Debes ingresar el tipo de planta para analizar.';
            } else if (modoFotoActivo) {
                mensajeAnalisis.textContent = 'Error: Debes subir una foto para analizar.';
  }
        }
        setTimeout(() => {
            mensajeAnalisis.textContent = '';
        }, 4000);
    });
  }



  
});