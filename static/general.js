// Prevent copying
const quantity_buttons = document.querySelectorAll('.quantity-btn');
quantity_buttons.forEach(quantity_button => {
    quantity_button.addEventListener('copy', (event) => {
        event.preventDefault();
    });
});
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