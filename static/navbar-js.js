// Get elements
const cartIcon = document.getElementById('cart-icon');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-btn');

// Function to toggle the sidebar visibility
function toggleSidebar(event) {
    // Prevent event from propagating to document
    event.stopPropagation();

    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-300px'; // Close the sidebar
        // Remove event listener to close sidebar when clicking outside
        document.removeEventListener('click', closeSidebarOutside);
    } else {
        sidebar.style.left = '0'; // Open the sidebar
        // Add event listener to close sidebar when clicking outside
        document.addEventListener('click', closeSidebarOutside);

        // Populate data in the sidebar
        if (typeof productWeights === 'undefined') {
             window.productWeights = JSON.parse(localStorage.getItem('cartList')) || {};
        }

        const weightsList = document.getElementById('cart-list');
        weightsList.innerHTML = ''; // Clear existing list

        // Loop through product weights and add them to the list if greater than 0
        Object.keys(productWeights).forEach(productId => {
            const {weight, name} = productWeights[productId];
            if (weight > 0) {
                const listItem = document.createElement('li');
                listItem.textContent = `${name}: ${weight} Kg`;
                weightsList.appendChild(listItem);
            }
        });

        // Print "No items in cart" if cart is empty
        if (weightsList.innerHTML === '') {
            const listItem = document.createElement('span');
            listItem.classList.add('empty-cart');
            listItem.textContent = 'No items in cart';
            weightsList.appendChild(listItem);
        }
    }
}

// Function to close the sidebar
function closeSidebar() {
    sidebar.style.left = '-300px'; // Slide out to the left
    // Remove event listener when sidebar is closed
    document.removeEventListener('click', closeSidebarOutside);
}

// Function to close the sidebar when clicking outside of it
function closeSidebarOutside(event) {
    // Check if the click was outside the sidebar and the cart icon
    if (!sidebar.contains(event.target) && event.target !== cartIcon) {
        sidebar.style.left = '-300px'; // Close the sidebar
        // Remove event listener after closing the sidebar
        document.removeEventListener('click', closeSidebarOutside);
    }
}

// Event listener for the cart icon to toggle sidebar visibility
cartIcon.addEventListener('click', toggleSidebar);

// Event listener for the close button inside the sidebar
closeBtn.addEventListener('click', closeSidebar);
