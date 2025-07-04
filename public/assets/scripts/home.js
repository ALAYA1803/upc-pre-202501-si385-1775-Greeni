document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    
    const sampleTasks = [
        { id: 1, icon: 'fa-tint', text: 'Regar Monstera Deliciosa', completed: true },
        { id: 2, icon: 'fa-leaf', text: 'Fertilizar Suculentas', completed: false },
        { id: 3, icon: 'fa-cut', text: 'Podar el Rosal', completed: true },
    ];

    const samplePlants = [
        { name: 'Monstera', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOXeWfFNwG6YUup06W69disC2MSGqUTPHVeA&s', status: 'healthy' },
        { name: 'Suculenta', image: 'https://veryplants.com/cdn/shop/articles/Exotic-succulent-plants..jpg?v=1706711966', status: 'healthy' },
        { name: 'Ficus', image: 'https://planterista.com/wp-content/uploads/2015/04/Ficus_benjamina_featured.webp', status: 'needs_attention' },
        { name: 'Hortensias', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Y0LjLsZnQ5f28ub5c4webhsgEGWhNNR6nA&s', status: 'needs_water' },
    ];

    const initHomePage = () => {
        currentUser = getUserData();
        if (!currentUser) return;

        populateWelcomeMessage(currentUser);
        renderTasks();
        renderPlants();
        setupEventListeners();
    };

    const getUserData = () => {
        const userDataJSON = sessionStorage.getItem('currentUser');
        if (!userDataJSON) {
            window.location.href = 'login.html';
            return null;
        }
        return JSON.parse(userDataJSON);
    };

    const populateWelcomeMessage = (user) => {
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            const userName = user.name.split(' ')[0]; 
            welcomeMessage.textContent = `Buenos días, ${userName}`;
        }
    };

    const renderTasks = () => {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;
        taskList.innerHTML = '';

        if (sampleTasks.length === 0) {
            taskList.innerHTML = '<p class="empty-state">¡No tienes tareas para hoy!</p>';
            return;
        }

        sampleTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <i class="fas ${task.icon} task-icon"></i>
                <span class="task-info">${task.text}</span>
                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
            `;
            taskList.appendChild(taskItem);
        });
    };

    const renderPlants = () => {
        const plantGallery = document.getElementById('plant-gallery');
        if (!plantGallery) return;
        plantGallery.innerHTML = ''; // Limpiar galería

        samplePlants.forEach(plant => {
            const plantCard = document.createElement('div');
            plantCard.className = 'plant-card';
            plantCard.innerHTML = `
                <div class="plant-card-img" style="background-image: url('${plant.image}')">
                    <div class="plant-status"></div>
                </div>
                <span class="plant-card-name">${plant.name}</span>
            `;
            plantGallery.appendChild(plantCard);
        });
    };
    const setupEventListeners = () => {
        const taskList = document.getElementById('task-list');
        if (taskList) {
            taskList.addEventListener('change', (event) => {
                if (event.target.classList.contains('task-checkbox')) {
                    const listItem = event.target.closest('.task-item');
                    listItem.classList.toggle('completed');
                }
            });
        }
    };

    initHomePage();
});
