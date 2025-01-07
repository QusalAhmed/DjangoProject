// Function to Show Toast
export function showToast(message) {
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
    }, 2000);
}

$(document).ready(function () {
    showToast('Logged in as Guest');
});