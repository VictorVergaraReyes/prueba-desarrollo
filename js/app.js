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
        { id: 'navbar-component', path: 'components/navbar.html' },
        { id: 'hero-component', path: 'components/hero.html' },
        { id: 'services-component', path: 'components/services.html' },
        { id: 'why-us-component', path: 'components/why-us.html' },
        { id: 'testimonials-component', path: 'components/testimonials.html' },
        { id: 'cta-component', path: 'components/cta.html' },
        { id: 'footer-component', path: 'components/footer.html' }
    ];

    // Load all components in parallel
    await Promise.all(components.map(c => loadComponent(c.id, c.path)));
});