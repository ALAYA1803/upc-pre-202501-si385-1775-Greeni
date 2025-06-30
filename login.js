document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        if (!email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        await checkUserCredentials(email, password);
    });
    async function checkUserCredentials(email, password) {
        const apiUrl = `https://6862d10a96f0cc4e34bb10c3.mockapi.io/api/v1/users?email=${encodeURIComponent(email)}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Hubo un problema al conectar con el servidor.');
            }
            const users = await response.json(); 

            if (users.length === 0) {
                alert('Error: Usuario no encontrado. Verifica tu correo electrónico.');
            } else {
                const user = users[0]; 
                if (user.password === password) {
                    alert(`¡Inicio de sesión exitoso! Bienvenido, ${user.name || 'usuario'}.`);
                } else {
                    alert('Error: Contraseña incorrecta.');
                }
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            alert('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.');
        }
    }
});