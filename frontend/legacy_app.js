document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const addForm = document.getElementById('add-form');
    const passwordContainer = document.getElementById('password-container');

    // Moverse a dashboard si ya está autenticado
    if (sessionStorage.getItem('isAuthenticated')) {
        showDashboard();
    }

    // --- LÓGICA DE LOGIN ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        // Validacion dummy (admin / 1234)
        if (user === 'admin' && pass === '1234') {
            sessionStorage.setItem('isAuthenticated', 'true');
            showDashboard();
            loginForm.reset();
            loginError.style.display = 'none';
        } else {
            loginError.style.display = 'block';
            // Efecto shake en error
            loginSection.style.animation = 'shake 0.5s';
            setTimeout(() => loginSection.style.animation = '', 500);
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAuthenticated');
        showLogin();
    });

    function showDashboard() {
        loginSection.classList.remove('active');
        setTimeout(() => {
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            setTimeout(() => dashboardSection.classList.add('active'), 50);
        }, 400); // Esperar que termine la transicion
        renderPasswords();
    }

    function showLogin() {
        dashboardSection.classList.remove('active');
        setTimeout(() => {
            dashboardSection.style.display = 'none';
            loginSection.style.display = 'block';
            setTimeout(() => loginSection.classList.add('active'), 50);
        }, 400);
    }

    // --- LÓGICA DEL GESTOR ---
    let passwords = JSON.parse(localStorage.getItem('myPasswords')) || [];

    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const siteName = document.getElementById('site-name').value;
        const siteEmail = document.getElementById('site-email').value;
        const sitePassword = document.getElementById('site-password').value;

        const newEntry = {
            id: Date.now().toString(),
            site: siteName,
            email: siteEmail,
            pass: sitePassword
        };

        passwords.push(newEntry);
        saveAndRender();
        addForm.reset();
    });

    function saveAndRender() {
        localStorage.setItem('myPasswords', JSON.stringify(passwords));
        renderPasswords();
    }

    function renderPasswords() {
        passwordContainer.innerHTML = '';
        if (passwords.length === 0) {
            passwordContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Aún no tienes contraseñas guardadas.</p>';
            return;
        }

        // Ordenar del mas reciente al mas antiguo
        const sortedPasswords = [...passwords].reverse();

        sortedPasswords.forEach(item => {
            const vaultItem = document.createElement('div');
            vaultItem.className = 'vault-item';
            
            // Reemplazar la pass con bolitas
            const hiddenPass = '•'.repeat(8);

            vaultItem.innerHTML = `
                <div class="item-info">
                    <span class="item-site">${item.site}</span>
                    <span class="item-email"><i class="fa-solid fa-envelope"></i> ${item.email}</span>
                    <div class="item-pass-container">
                        <span class="item-pass" id="pass-${item.id}">${hiddenPass}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="action-btn view" onclick="togglePass('${item.id}', '${item.pass}')" title="Ver/Ocultar contraseña"><i class="fa-solid fa-eye"></i></button>
                    <button class="action-btn copy" onclick="copyPass('${item.pass}')" title="Copiar contraseña al portapapeles"><i class="fa-solid fa-copy"></i></button>
                    <button class="action-btn delete" onclick="deletePass('${item.id}')" title="Eliminar del gestor"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            passwordContainer.appendChild(vaultItem);
        });
    }

    // --- FUNCIONES GLOBALES PARA LOS BOTONES ---
    window.togglePass = function(id, realPass) {
        const passElement = document.getElementById(`pass-${id}`);
        const currentText = passElement.innerText;
        
        if (currentText.includes('•')) {
            passElement.innerText = realPass; // Mostrar
        } else {
            passElement.innerText = '•'.repeat(8); // Ocultar
        }
    };

    window.copyPass = function(password) {
        navigator.clipboard.writeText(password).then(() => {
            alert('¡Contraseña copiada al portapapeles!');
        }).catch(err => {
            console.error('Error al copiar: ', err);
            alert('Error al copiar al portapapeles');
        });
    };

    window.deletePass = function(id) {
        if(confirm('¿Estás seguro de eliminar esta credencial? Esta acción no se puede deshacer.')) {
            passwords = passwords.filter(p => p.id !== id);
            saveAndRender();
        }
    };
});

// Keyframes para shake animation añadida directo al doc
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}`;
document.head.appendChild(style);
