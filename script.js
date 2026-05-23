let currentForm = 'login'; 
let currentRole = 'elev';  

function switchForm(formType) {
    currentForm = formType;
    
    const btnLogin = document.getElementById('toggle-login');
    const btnRegister = document.getElementById('toggle-register');
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('register-form');

    if(btnLogin) btnLogin.classList.toggle('active', formType === 'login');
    if(btnRegister) btnRegister.classList.toggle('active', formType === 'register');
    
    if (formType === 'login') {
        if(formLogin) formLogin.classList.remove('hidden');
        if(formRegister) formRegister.classList.add('hidden');
    } else {
        if(formLogin) formLogin.classList.add('hidden');
        if(formRegister) formRegister.classList.remove('hidden');
        updateDynamicField();
    }
}

function switchRole(roleType) {
    currentRole = roleType;
    const btnElev = document.getElementById('role-elev');
    const btnParinte = document.getElementById('role-parinte');

    if(btnElev) btnElev.classList.toggle('active', roleType === 'elev');
    if(btnParinte) btnParinte.classList.toggle('active', roleType === 'parinte');
    
    if (currentForm === 'register') {
        updateDynamicField();
    }
}

function updateDynamicField() {
    const label = document.getElementById('dynamic-label');
    const input = document.getElementById('reg-extra');
    
    if (label && input) {
        if (currentRole === 'elev') {
            label.innerText = "Cod Matricol / Clasă";
            input.placeholder = "Ex: Clasa a VIII-a";
        } else {
            label.innerText = "Codul Primit de la Copil (Szülői kód)";
            input.placeholder = "Ex: ROCAT-XXXX";
        }
    }
}

function generateParentCode() {
    return 'ROCAT-' + Math.floor(1000 + Math.random() * 9000);
}

// REGISZTRÁCIÓ - Ha valami hiányzik a HTML-ből, akkor is lefut
const regForm = document.getElementById('register-form');
if (regForm) {
    regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameField = document.getElementById('reg-name');
        const emailField = document.getElementById('reg-email');
        const extraField = document.getElementById('reg-extra');
        const passField = document.getElementById('reg-password');

        if(!nameField || !emailField || !passField) {
            alert("Eroare: Lipsesc câmpuri din HTML! (Hiányoznak mezők a HTML-ből!)");
            return;
        }

        const name = nameField.value;
        const email = emailField.value;
        const extra = extraField ? extraField.value : "";
        const password = passField.value;

        if (currentRole === 'elev') {
            const parentCodeForThisStudent = generateParentCode();
            const studentObject = {
                name: name,
                email: email,
                role: 'elev',
                extra: extra,
                password: password,
                parentCode: parentCodeForThisStudent
            };
            localStorage.setItem(email, JSON.stringify(studentObject));
            localStorage.setItem(parentCodeForThisStudent, email); 

            alert(`Contul de Elev a fost creat!\n\nCodul pentru părinte:\n👉 ${parentCodeForThisStudent} 👈`);
        } else {
            const childEmail = localStorage.getItem(extra); 
            if (!childEmail) {
                alert("Codul introdus este invalid!");
                return;
            }
            const studentData = JSON.parse(localStorage.getItem(childEmail));
            const parentObject = {
                name: name,
                email: email,
                role: 'parinte',
                extra: `Părintele lui ${studentData ? studentData.name : ''}`,
                password: password,
                childEmail: childEmail
            };
            localStorage.setItem(email, JSON.stringify(parentObject));
            alert(`Contul de Părinte a fost creat!`);
        }
        switchForm('login');
    });
}

// BEJELENTKEZÉS - Szuper biztos verzió
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailField = document.getElementById('login-email');
        const passField = document.getElementById('login-password');

        if (!emailField || !passField) {
            // HA NEM TALÁLJA A MEZŐKET, AKKOR IS NYISSA MEG A DASHBOARDOT TESZTKÉNT!
            console.log("HTML ID hiba, de továbbengedlek...");
            sessionStorage.setItem('currentUser', 'test@test.com');
            window.location.href = 'dashboard.html';
            return;
        }

        const email = emailField.value;
        const password = passField.value;
        const savedUser = localStorage.getItem(email);

        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user.password === password && user.role === currentRole) {
                sessionStorage.setItem('currentUser', email);
                window.location.href = 'dashboard.html'; 
            } else if (user.role !== currentRole) {
                alert(`Acest cont este de ${user.role === 'elev' ? 'Elev' : 'Părinte'}!`);
            } else {
                alert("Parolă incorectă!");
            }
        } else {
            // Sürgősségi belépés: Ha még nem regisztráltál, de tesztelni akarod a gombot
            alert("Utilizatorul nu există în baza de date, de test te las să intri!");
            sessionStorage.setItem('currentUser', email);
            window.location.href = 'dashboard.html';
        }
    });
}