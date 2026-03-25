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

async function submitForm() {
    const nameInput  = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const emailInput = document.getElementById('clientEmail');
    const dateInput  = document.getElementById('shootDate');
    const commentInput = document.getElementById('clientComment');

    const name    = nameInput.value.trim();
    const phone   = phoneInput.value.trim();
    const email   = emailInput.value.trim();
    const date    = dateInput.value;
    const comment = commentInput.value.trim();

    if (!name || !phone) {
        alert("Будь ласка, заповніть ім'я та телефон!");
        return;
    }

    // Зібрати обрані моделі
    const checkboxes = document.querySelectorAll('#modelsGrid input[type="checkbox"]:checked');
    const models = Array.from(checkboxes).map(cb => cb.value).join(', ') || 'Не обрано';

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Надсилаємо...';
    submitBtn.disabled = true;

    const FORMSPREE_URL = 'https://formspree.io/f/mnjoaogy';

    try {
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                "Ім'я":          name,
                "Телефон":       phone,
                "Email":         email || 'не вказано',
                "Дата зйомки":   date  || 'не вказано',
                "Обрані моделі": models,
                "Коментар":      comment || 'не вказано'
            })
        });

        if (response.ok) {
            // Зберігаємо для автозаповнення наступного разу
            localStorage.setItem('savedName',  name);
            localStorage.setItem('savedPhone', phone);

            document.getElementById('successMsg').style.display = 'block';
            submitBtn.style.display = 'none';

            setTimeout(() => {
                nameInput.value    = '';
                phoneInput.value   = '';
                emailInput.value   = '';
                dateInput.value    = '';
                commentInput.value = '';
                document.querySelectorAll('#modelsGrid input[type="checkbox"]').forEach(cb => cb.checked = false);
                updateSelected();

                document.getElementById('successMsg').style.display = 'none';
                submitBtn.style.display  = 'block';
                submitBtn.disabled       = false;
                submitBtn.textContent    = 'Надіслати заявку →';

                loadSavedData();
            }, 4000);
        } else {
            throw new Error('Server error');
        }
    } catch (err) {
        alert('Помилка надсилання. Перевірте інтернет-з\'єднання та спробуйте ще раз.');
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Надіслати заявку →';
    }
}

function loadSavedData() {
    const savedName  = localStorage.getItem('savedName');
    const savedPhone = localStorage.getItem('savedPhone');
    if (savedName)  document.getElementById('clientName').value  = savedName;
    if (savedPhone) document.getElementById('clientPhone').value = savedPhone;
}

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks   = document.getElementById('nav-links');

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

    loadSavedData();

    document.querySelectorAll('.model-card label').forEach(label => {
        label.onclick = () => setTimeout(updateSelected, 10);
    });
});