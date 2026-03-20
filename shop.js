function updateSelected() {
    const checkboxes = document.querySelectorAll('#modelsGrid input[type="checkbox"]:checked');
    const display = document.getElementById('selectedDisplay');

    if (checkboxes.length === 0) {
        display.innerHTML = '<span style="color:#aaa;">Оберіть моделей вище ↑</span>';
    } else {
        display.innerHTML = Array.from(checkboxes)
            .map(cb => `<span class="tag">✓ ${cb.value}</span>`)
            .join('');
    }
}

function submitForm() {
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !phone) {
        alert("Будь ласка, заповніть ім'я та телефон!");
        return;
    }

    // --- ПАМ'ЯТЬ: Зберігаємо дані в браузері перед очищенням ---
    localStorage.setItem('savedName', name);
    localStorage.setItem('savedPhone', phone);

    document.getElementById('successMsg').style.display = 'block';
    document.querySelector('.submit-btn').style.display = 'none';

    setTimeout(() => {
        // Очищуємо форму
        document.getElementById('clientName').value = '';
        document.getElementById('clientPhone').value = '';
        document.getElementById('clientEmail').value = '';
        document.getElementById('shootDate').value = '';
        document.getElementById('clientComment').value = '';
        document.querySelectorAll('#modelsGrid input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        updateSelected();
        
        document.getElementById('successMsg').style.display = 'none';
        document.querySelector('.submit-btn').style.display = 'block';
        
        // Після очищення можемо знову підставити збережені дані як підказку
        loadSavedData(); 
    }, 4000);
}

// Функція для завантаження збережених даних
function loadSavedData() {
    const savedName = localStorage.getItem('savedName');
    const savedPhone = localStorage.getItem('savedPhone');

    if (savedName) document.getElementById('clientName').value = savedName;
    if (savedPhone) document.getElementById('clientPhone').value = savedPhone;
}

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

    // --- ПАМ'ЯТЬ: Підставляємо дані при завантаженні сторінки ---
    loadSavedData();

    document.querySelectorAll('.model-card label').forEach(label => {
        label.onclick = () => {
            setTimeout(updateSelected, 10); 
        };
    });
});