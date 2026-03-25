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
    const nameInput    = document.getElementById('clientName');
    const phoneInput   = document.getElementById('clientPhone');
    const emailInput   = document.getElementById('clientEmail');
    const dateInput    = document.getElementById('shootDate');
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

    const checkboxes = document.querySelectorAll('#modelsGrid input[type="checkbox"]:checked');
    const models = Array.from(checkboxes).map(cb => cb.value).join(', ') || 'Не обрано';

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Надсилаємо...';
    submitBtn.disabled = true;

    const templateParams = {
        name:    name,
        phone:   phone,
        email:   email   || 'не вказано',
        date:    date    || 'не вказано',
        models:  models,
        comment: comment || 'не вказано'
    };

    emailjs.send('service_gfo0mav', 'template_3la7zjo', templateParams)
        .then(() => {
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
        })
        .catch((error) => {
            console.error('EmailJS error:', error);
            alert('Помилка надсилання. Спробуйте ще раз.');
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Надіслати заявку →';
        });
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