document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://6862d10a96f0cc4e34bb10c3.mockapi.io/api/v1/users';
    let initialProfileState = {};
    let currentUser = null; 
    const profileForm = document.getElementById('profile-form');
    const passwordForm = document.getElementById('password-form');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const initProfilePage = () => {
        currentUser = getUserDataFromSession();
        if (!currentUser) return;

        populateProfileData(currentUser);
        setupEventListeners();
    };
    const getUserDataFromSession = () => {
        const userDataJSON = sessionStorage.getItem('currentUser');
        if (!userDataJSON) {
            window.location.href = 'login.html';
            return null;
        }
        return JSON.parse(userDataJSON);
    };

    const getInitials = (name) => {
        if (!name) return '--';
        const parts = name.trim().split(' ');
        const initials = parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '');
        return initials.toUpperCase();
    };
    const populateProfileData = (user) => {
        document.getElementById('profile-name-header').textContent = user.name;
        document.getElementById('profile-email-header').textContent = user.email;
        document.getElementById('fullName').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('avatar-initials').textContent = getInitials(user.name);

        initialProfileState = { name: user.name, email: user.email };
    };

    const showFeedback = (elementId, message, type) => {
        const feedbackElement = document.getElementById(elementId);
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.className = `feedback-message ${type}`;
            setTimeout(() => {
                feedbackElement.textContent = '';
                feedbackElement.className = 'feedback-message';
            }, 4000);
        }
    };
    const setupEventListeners = () => {
        const tabs = document.querySelectorAll('.tab-link');
        const sections = document.querySelectorAll('.profile-section');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(item => item.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.section).classList.add('active');
            });
        });
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.previousElementSibling;
                input.type = input.type === 'password' ? 'text' : 'password';
                toggle.classList.toggle('fa-eye-slash');
            });
        });
        profileForm.addEventListener('input', () => {
            const currentState = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
            };
            const hasChanged = JSON.stringify(currentState) !== JSON.stringify(initialProfileState);
            saveProfileBtn.disabled = !hasChanged;
        });
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            saveProfileBtn.disabled = true;
            saveProfileBtn.textContent = 'Guardando...';

            const newName = document.getElementById('fullName').value;
            const newEmail = document.getElementById('email').value;

            try {
                const response = await fetch(`${API_URL}?email=${encodeURIComponent(currentUser.email)}`);
                if (!response.ok) throw new Error('Error al buscar el usuario.');               
                const users = await response.json();
                if (users.length === 0) throw new Error('Usuario no encontrado en la API.');              
                const userId = users[0].id;
                const updateResponse = await fetch(`${API_URL}/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName, email: newEmail }),
                });
                if (!updateResponse.ok) throw new Error('No se pudo actualizar el perfil.');
                const updatedUserData = { name: newName, email: newEmail };
                sessionStorage.setItem('currentUser', JSON.stringify(updatedUserData));
                currentUser = updatedUserData; 
                populateProfileData(currentUser); 

                showFeedback('profile-feedback', '¡Perfil actualizado con éxito!', 'success');

            } catch (error) {
                console.error("Error al guardar perfil:", error);
                showFeedback('profile-feedback', error.message, 'error');
            } finally {
                saveProfileBtn.textContent = 'Guardar Cambios';
            }
        });
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updateButton = passwordForm.querySelector('button');
            updateButton.disabled = true;
            updateButton.textContent = 'Actualizando...';
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (newPassword !== confirmPassword) {
                showFeedback('password-feedback', 'Las nuevas contraseñas no coinciden.', 'error');
                updateButton.disabled = false;
                updateButton.textContent = 'Actualizar Contraseña';
                return;
            }
            if (newPassword.length < 8) {
                showFeedback('password-feedback', 'La nueva contraseña debe tener al menos 8 caracteres.', 'error');
                updateButton.disabled = false;
                updateButton.textContent = 'Actualizar Contraseña';
                return;
            }
            try {
                const response = await fetch(`${API_URL}?email=${encodeURIComponent(currentUser.email)}`);
                if (!response.ok) throw new Error('Error al buscar el usuario.');
                const users = await response.json();
                if (users.length === 0) throw new Error('Usuario no encontrado.');
                const userFromApi = users[0];
                if (userFromApi.password !== currentPassword) {
                    throw new Error('La contraseña actual es incorrecta.');
                }
                const updateResponse = await fetch(`${API_URL}/${userFromApi.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: newPassword }),
                });

                if (!updateResponse.ok) throw new Error('No se pudo actualizar la contraseña.');

                showFeedback('password-feedback', '¡Contraseña actualizada con éxito!', 'success');
                passwordForm.reset();

            } catch (error) {
                console.error("Error al cambiar contraseña:", error);
                showFeedback('password-feedback', error.message, 'error');
            } finally {
                updateButton.disabled = false;
                updateButton.textContent = 'Actualizar Contraseña';
            }
        });
    };
    initProfilePage();
});
