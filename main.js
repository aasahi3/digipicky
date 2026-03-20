document.addEventListener('DOMContentLoaded', () => {

    // --- БУРГЕР-МЕНЮ ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            menuToggle.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                menuToggle.classList.remove('open');
            });
        });
    }

    // --- REVEAL АНІМАЦІЯ ---
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('active');
            });
        }, { threshold: 0.15 });
        reveals.forEach(r => observer.observe(r));
    }

    // --- АВТОСЛАЙДЕР ---
    let currentSlide = 1;
    setInterval(() => {
        currentSlide = currentSlide >= 6 ? 1 : currentSlide + 1;
        const slideInput = document.getElementById('slide' + currentSlide);
        if (slideInput) slideInput.checked = true;
    }, 5000);

});