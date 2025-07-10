document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const cedulaInput = document.getElementById('cedula');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    // Función para mostrar notificación moderna
    function showAlert(message, type = 'error') {
        // Eliminar notificaciones previas
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        // Mostrar alerta
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    }

    // Toggle para mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Validación de cédula (solo números, 7-9 dígitos)
    cedulaInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, ''); // Solo permite números
    });

    // Validación del formulario al enviar
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar cédula
        const cedula = cedulaInput.value.trim();
        if (!cedula) {
            showAlert('Por favor ingrese su cédula de identidad');
            cedulaInput.focus();
            return;
        }
        
        if (cedula.length < 7 || cedula.length > 9) {
            showAlert('La cédula debe tener entre 7 y 9 dígitos');
            cedulaInput.focus();
            return;
        }
        
        // Validar contraseña
        const password = passwordInput.value.trim();
        if (!password) {
            showAlert('Por favor ingrese su contraseña');
            passwordInput.focus();
            return;
        }
        
        if (password.length > 20) {
            showAlert('La contraseña no puede exceder los 20 caracteres');
            passwordInput.focus();
            return;
        }
        
        // Si todo está correcto, enviar el formulario
        this.submit();
    });
});