/**
 * Login system for the Ottoman Empire game
 */

document.addEventListener('DOMContentLoaded', function() {
    // Login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showLoginMessage('Kullanıcı adı ve şifre giriniz!', 'error');
                return;
            }
            
            login(username, password);
        });
    }
    
    // Register button
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showLoginMessage('Kullanıcı adı ve şifre giriniz!', 'error');
                return;
            }
            
            register(username, password);
        });
    }
    
    // Check if user is already logged in
    checkSession();
});

/**
 * Show login message
 * @param {string} message - Message to display
 * @param {string} type - Message type (error or success)
 */
function showLoginMessage(message, type = '') {
    const messageElement = document.getElementById('login-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = 'login-message';
        
        if (type) {
            messageElement.classList.add(type);
        }
    }
}

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 */
function login(username, password) {
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error) {
            showLoginMessage(data.message, 'success');
            
            // Show difficulty selection after successful login
            setTimeout(() => {
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('difficulty-selection').style.display = 'block';
                gameState.loginRequired = false;
            }, 1000);
        } else {
            showLoginMessage(data.message, 'error');
        }
    })
    .catch(error => {
        showLoginMessage('Bağlantı hatası! Lütfen tekrar deneyiniz.', 'error');
        console.error('Login error:', error);
    });
}

/**
 * Register user
 * @param {string} username - Username
 * @param {string} password - Password
 */
function register(username, password) {
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error) {
            showLoginMessage(data.message, 'success');
            
            // Show difficulty selection after successful registration
            setTimeout(() => {
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('difficulty-selection').style.display = 'block';
                gameState.loginRequired = false;
            }, 1000);
        } else {
            showLoginMessage(data.message, 'error');
        }
    })
    .catch(error => {
        showLoginMessage('Bağlantı hatası! Lütfen tekrar deneyiniz.', 'error');
        console.error('Registration error:', error);
    });
}

/**
 * Check if user is already logged in
 */
function checkSession() {
    fetch('/api/user')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            // Skip login screen if already logged in
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('difficulty-selection').style.display = 'block';
            gameState.loginRequired = false;
            
            // Show welcome message
            utils.log(`<strong>${data.username}</strong> olarak giriş yapıldı. Hoş geldiniz!`);
        }
    })
    .catch(error => {
        console.error('Session check error:', error);
    });
}

/**
 * Logout user
 */
function logout() {
    fetch('/api/logout', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error) {
            // Redirect to login screen
            window.location.reload();
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
    });
}