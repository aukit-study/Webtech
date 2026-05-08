document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form refresh

    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        window.showNotification('Passwords do not match', 'info');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, firstName })
        });

        const result = await response.json().catch(() => ({}));

        if (response.status === 201) {
            localStorage.setItem('userToken', result.token);
            window.showNotification(result.message || 'Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500); // Give time for toast to show
        } else {
            window.showNotification(result.message || 'Registration failed', 'info');
        }
    } catch (error) {
        console.error('Registration error:', error);
        window.showNotification('Unable to connect to server', 'info');
    }
});