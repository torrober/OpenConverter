
// Function to detect if the system is in dark mode
function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Function to add 'data-bs-theme' attribute to the element based on dark mode
function updateThemeAttribute() {
    var heading = document.getElementById('body');
    if (isDarkMode()) {
        heading.setAttribute('data-bs-theme', 'dark');
    } else {
        heading.removeAttribute('data-bs-theme');
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    var heading = document.getElementById('body');
    if (heading.hasAttribute('data-bs-theme')) {
        heading.removeAttribute('data-bs-theme');
    } else {
        heading.setAttribute('data-bs-theme', 'dark');
    }
}

window.addEventListener('DOMContentLoaded', function (e) {
    updateThemeAttribute();
});
