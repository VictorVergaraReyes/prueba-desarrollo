async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
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

