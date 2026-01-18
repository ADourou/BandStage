"use strict";


window.onload = function() {
    checkLoginStatus();
};

function checkLoginStatus() {
    fetch('/check-login')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            showProfileSection(data.user);
        } else {
            showLoginSection();
        }
    })
    .catch(err => console.error(err));
}


function login() {
    // kobo ligo kena ktl 
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const msg = document.getElementById('loginMessage');

    msg.style.display = 'none';


    console.log("login with:", username, password); 

    if (!username || !password) {
        msg.style.display = 'block';
        msg.textContent = 'Complete all fields.';
        return;
    }

    fetch(`/users/details?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('User not exists or incorrect password');
    })
    .then(user => {
        console.log("Success:", user);
        showProfileSection(user);
    })
    .catch(error => {
        console.error("Error:", error);
        msg.style.display = 'block';
        msg.textContent = error.message;
    });
}


function logout() {
    fetch('/logout')
    .then(() => {
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        showLoginSection();
    });
}


function updateProfile() {
    const form = document.getElementById('profileForm');
    const msg = document.getElementById('profileMessage');
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });

   
    fetch('/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Update failed.');
    })
    .then(result => {
        msg.style.display = 'block';
        msg.style.color = 'green';
        msg.textContent = result.message;
        
        console.log("Updated User Data:", result.user);
    })
    .catch(error => {
        msg.style.display = 'block';
        msg.style.color = 'red';
        msg.textContent = 'Error: ' + error.message;
    });
}



function showLoginSection() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('profileSection').style.display = 'none';
    document.getElementById('pageTitle').textContent = "Login";
}

function showProfileSection(user) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('profileSection').style.display = 'block';


    const container = document.getElementById('profileFields');
    container.innerHTML = '';

    const fields = [
        { key: 'username', label: 'Username', locked: true }, // den allazei
        { key: 'email', label: 'Email', locked: true },       // den allazei
        { key: 'firstname', label: 'Name', locked: false },
        { key: 'lastname', label: 'Surname', locked: false },
        { key: 'birthdate', label: 'Birthdate', locked: false, type: 'date' },
        { key: 'telephone', label: 'Phone', locked: false },
        { key: 'country', label: 'Country', locked: false },
        { key: 'city', label: 'City', locked: false },
        { key: 'address', label: 'Address', locked: false },
    ];

    fields.forEach(field => {
       
        if (user[field.key] !== undefined) {
            const div = document.createElement('div');
            div.className = 'field';
            
            const label = document.createElement('label');
            label.textContent = field.label;
            
            const input = document.createElement('input');
            input.type = field.type || 'text';
            input.value = user[field.key];
            input.name = field.key;
            
            // for date, making it XXXX-MM-DD
            let value = user[field.key];
            if (field.key === 'birthdate' && value) {
                value = value.toString().split('T')[0];
            }
            input.value = value;
        
            if (field.locked) {
                input.disabled = true;
                input.title = "Cannot change this field";
            }

            div.appendChild(label);
            div.appendChild(input);
            container.appendChild(div);
        }
    });
}