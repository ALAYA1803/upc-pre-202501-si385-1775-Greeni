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
  
});