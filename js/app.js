async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Form Validation
const validators = {
    fullName: (value) => {
        if (!value.trim()) {
            return 'El nombre completo es requerido';
        }
        if (value.trim().length < 3) {
            return 'El nombre debe tener al menos 3 caracteres';
        }
        if (!/^[a-záéíóúñ\s]+$/i.test(value)) {
            return 'El nombre solo puede contener letras y espacios';
        }
        return null;
    },

    email: (value) => {
        if (!value.trim()) {
            return 'El correo electrónico es requerido';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Ingresa un correo electrónico válido';
        }
        return null;
    },

    phone: (value) => {
        if (!value.trim()) {
            return 'El teléfono es requerido';
        }
        // Validar formato mexicano: +52, (XX) XXXX-XXXX, 10 dígitos, etc.
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            return 'Ingresa un teléfono válido';
        }
        return null;
    },

    state: (value) => {
        if (!value || value === '') {
            return 'Selecciona un estado';
        }
        return null;
    },

    city: (value) => {
        if (!value || value === '') {
            return 'Selecciona una ciudad';
        }
        return null;
    },

    profile: () => {
        const selectedProfile = document.querySelector('input[name="profile"]:checked');
        if (!selectedProfile) {
            return 'Selecciona un perfil';
        }
        return null;
    },

    message: (value) => {
        if (!value.trim()) {
            return 'El mensaje es requerido';
        }
        if (value.trim().length < 10) {
            return 'El mensaje debe tener al menos 10 caracteres';
        }
        return null;
    }
};

function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const fieldElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
    if (fieldElement) {
        fieldElement.classList.remove('is-invalid');
        fieldElement.classList.remove('is-valid');
    }
}

function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const fieldElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    if (fieldElement) {
        fieldElement.classList.add('is-invalid');
    }
}

function showSuccess(fieldName) {
    const fieldElement = document.getElementById(fieldName);
    if (fieldElement) {
        fieldElement.classList.remove('is-invalid');
        fieldElement.classList.add('is-valid');
    }
}

function validateField(fieldName) {
    const validator = validators[fieldName];
    if (!validator) return true;

    const fieldElement = document.getElementById(fieldName);
    const value = fieldElement ? fieldElement.value : '';

    const error = validator(value);

    if (error) {
        showError(fieldName, error);
        return false;
    } else {
        clearError(fieldName);
        showSuccess(fieldName);
        return true;
    }
}

function validateForm() {
    const fields = ['fullName', 'email', 'phone', 'state', 'city', 'profile', 'message'];
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function attachFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Validación en tiempo real
    ['fullName', 'email', 'phone', 'state', 'city', 'message'].forEach(fieldName => {
        const fieldElement = document.getElementById(fieldName);
        if (fieldElement) {
            fieldElement.addEventListener('blur', () => validateField(fieldName));
            fieldElement.addEventListener('input', () => {
                if (document.getElementById(`${fieldName}-error`).classList.contains('show')) {
                    validateField(fieldName);
                }
            });
        }
    });

    // Validación de radio buttons
    const profileInputs = document.querySelectorAll('input[name="profile"]');
    profileInputs.forEach(input => {
        input.addEventListener('change', () => validateField('profile'));
    });

    // Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Recopilar datos del formulario
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                state: document.getElementById('state').value,
                city: document.getElementById('city').value,
                profile: document.querySelector('input[name="profile"]:checked').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            // Convertir a JSON
            const jsonData = JSON.stringify(formData, null, 2);

            // Imprimir en consola
            console.log('Datos del formulario válido:');
            console.log(jsonData);
            console.log('Objeto completo:', formData);

            alert('¡Formulario enviado correctamente!');

            // Limpiar formulario
            form.reset();
            // Limpiar estilos de validación
            ['fullName', 'email', 'phone', 'state', 'city', 'message'].forEach(clearError);
        }
    });
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const components = [
        { id: 'header-component', path: 'components/header.html' },
        { id: 'hero-component', path: 'components/hero.html' },
        { id: 'institutions-component', path: 'components/institutions.html' },
        { id: 'form-component', path: 'components/form.html' },
        { id: 'footer-component', path: 'components/footer.html' },
        { id: 'contactanos-component', path: 'components/buttons/contactanos.html' }
    ];

    // Load all components in parallel
    await Promise.all(components.map(c => loadComponent(c.id, c.path)));

    // Attach form validation after components are loaded
    attachFormValidation();
});


document.addEventListener('alpine:init', () => {
    // Global Store
    Alpine.store('app', {
        mobileMenu: false,
        toggleMenu() {
            this.mobileMenu = !this.mobileMenu;
        }
    });

    // Navbar Component
    Alpine.data('header', () => ({        }));

    // Hero Component
    Alpine.data('hero', () => ({
    }));

    Alpine.data('institutions', () => ({
        isPlaying: true,
        speed: 15,

        toggleAnimation() {
            this.isPlaying = !this.isPlaying;
        },

        setSpeed(newSpeed) {
            this.speed = newSpeed;
        },

        get animationStyle() {
            return this.isPlaying ? `animation-duration: ${this.speed}s;` : 'animation-play-state: paused;';
        }
    }));

    Alpine.data('customButton', (config = {}) => ({
        variant: config.variant || 'primary',
        size: config.size || 'md',
        disabled: config.disabled || false,
        loading: config.loading || false,
        
        get classes() {
        const variants = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
            danger: 'bg-red-600 hover:bg-red-700 text-white',
            success: 'bg-green-600 hover:bg-green-700 text-white'
        };
        
        const sizes = {
            sm: 'px-3 py-1 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg'
        };
        
        return `${variants[this.variant]} ${sizes[this.size]} rounded transition-colors`;
        }
    }));
});

