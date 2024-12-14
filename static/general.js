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