document.addEventListener('DOMContentLoaded', () => {
    const loadSidebar = async () => {
        const sidebarContainer = document.getElementById('sidebar-container');
        if (!sidebarContainer) return;
        try {
            const response = await fetch('sidebar.html');
            if (!response.ok) throw new Error('No se pudo cargar el sidebar.');           
            sidebarContainer.innerHTML = await response.text();
            populateUserProfile(); 
            setActiveLink();
            handleMenuToggle();
            handleLogout();

        } catch (error) {
            console.error('Error al cargar el sidebar:', error);
            sidebarContainer.innerHTML = '<p>Error al cargar el menú.</p>';
        }
    };
    const populateUserProfile = () => {
        const userDataJSON = sessionStorage.getItem('currentUser');
        if (!userDataJSON) {
            console.warn('No hay usuario logueado. Redirigiendo a login...');
            return;
        }

        const user = JSON.parse(userDataJSON);
        const avatarEl = document.getElementById('user-avatar');
        const nameEl = document.getElementById('user-name');
        const emailEl = document.getElementById('user-email');

        if (avatarEl && nameEl && emailEl) {
            nameEl.textContent = user.name;
            emailEl.textContent = user.email;
            avatarEl.textContent = getInitials(user.name);
        }
    };
     const handleLogout = () => {
        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', (event) => {
                event.preventDefault(); 
                sessionStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            });
        }
    };
    const getInitials = (name) => {
        if (!name) return '--';
        const nameParts = name.trim().split(' ');
        const firstNameInitial = nameParts[0] ? nameParts[0][0] : '';
        const lastNameInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
        return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
    };
    const setActiveLink = () => {
        const navLinks = document.querySelectorAll('#nav-links a');
        const currentPage = window.location.pathname.split('/').pop();

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };
    const handleMenuToggle = () => {
        const menuButton = document.getElementById('menu-toggle');
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-open');
            });
        }
    };
    loadSidebar();
});
