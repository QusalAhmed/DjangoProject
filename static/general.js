// Get current url
const currentUrl = window.location.href;
if (!currentUrl.includes('localhost:8000')) {
    // Disable right-click and copy
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
            event.preventDefault();
        }
    });
}

// Toast
// Function to Show Toast
function showToast(message) {
    // Get the toast container
    const toastContainer = document.getElementById('toast-box');

    // Create a new toast element
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;

    // Append the toast to the container
    toastContainer.appendChild(toast);

    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        // Wait for the animation to complete before removing from DOM
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

$(document).ready(function () {
    showToast('You are logged in as Guest');
});

// Bootstrap tooltips activation
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))