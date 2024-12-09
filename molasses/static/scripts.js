// Parse product data from the embedded script tag
const productData = JSON.parse(document.getElementById('product-data').textContent.trim().replace(/'/g, '"'));


function generateDigits(container, maxWeight) {
    container.innerHTML = '';
    for (let i = 0; i <= maxWeight; i++) {
        const digitElement = document.createElement('div');
        digitElement.classList.add('digit');
        digitElement.textContent = i.toLocaleString('en-BD');
        container.appendChild(digitElement);
    }
}

function updateWeight(productId, change) {
    const maxWeight = 99;
    const digitHeight = 30;
    const product = productData.find(p => p.id === productId);
    if (!product) return; // If the product is not found, exit the function

    const weightContainer = document.querySelector(`#quantity-${productId}`);

    // Update the product weight within the valid range
    productWeights[productId].weight = Math.max(0, Math.min(productWeights[productId].weight + change, maxWeight));

    // Update the displayed weight
    weightContainer.style.transform = `translateY(-${productWeights[productId].weight * digitHeight}px)`;

    // Update the list of selected weights
    updateSelectedWeights();

    // Update the invoice table
    populateOrderTable();
}

// Update the selected weights list in the UI
function updateSelectedWeights() {
    const weightsList = document.getElementById('weights-list');
    weightsList.innerHTML = ''; // Clear existing list

    // Loop through product weights and add them to the list if greater than 0
    Object.keys(productWeights).forEach(productId => {
        const {weight, name} = productWeights[productId];
        if (weight > 0) {
            const listItem = document.createElement('li');
            listItem.textContent = `${name}: ${weight} Kg`;
            weightsList.appendChild(listItem);
        }
        // Store the cartList in localStorage
        localStorage.setItem('cartList', JSON.stringify(productWeights));
    });
}

let productWeights = JSON.parse(localStorage.getItem('cartList')) || {};
document.addEventListener('DOMContentLoaded', () => {
    if (Object.keys(productWeights).length === productData.length) {
        Object.keys(productWeights).forEach(productId => {
            const {weight} = productWeights[productId];
            const weightContainer = document.querySelector(`#quantity-${productId}`);
            weightContainer.style.transform = `translateY(-${weight * 30}px)`;
            updateSelectedWeights();
        });
        productData.forEach(product => {
            generateDigits(document.querySelector(`#quantity-${product.id}`), 1000);
        });
    } else {
        productWeights = {};
        productData.forEach(product => {
            productWeights[product.id] = {weight: 0, name: product.name, price: product.price};
            console.log(productWeights[product.id])
            generateDigits(document.querySelector(`#quantity-${product.id}`), 1000);
        });
        localStorage.setItem('cartList', JSON.stringify(productWeights));
    }

    // Populate the invoice table on page load
    populateOrderTable();
});

// Order invoice
const deliveryCharge = 100; // Fixed delivery charge

// Function to populate the order table
function populateOrderTable() {
    const orderBody = document.getElementById("order-body");
    let subtotal = 0;
    orderBody.innerHTML = "";

    Object.keys(productWeights).forEach(productId => {
        const row = document.createElement("tr");
        const {weight, name, price} = productWeights[productId];
        if (weight <= 0) return; // Skip items with no weight

        row.innerHTML = `
                    <td>${name}</td>
                    <td class="centered">${price}</td>
                    <td class="symbol-cell">×</td>
                    <td class="centered">${weight}</td>
                    <td class="symbol-cell">=</td>
                    <td class="centered">${(price * weight).toLocaleString('en-BD')}`;
        orderBody.appendChild(row);

        // Calculate subtotal
        subtotal += price * weight;
    });

    let totalPrice = subtotal === 0 ? 0 : subtotal + deliveryCharge;
    document.getElementById("subtotal-price").textContent = subtotal.toLocaleString('en-BD');
    document.getElementById("total-price").textContent = (totalPrice).toLocaleString('en-BD');
    document.getElementById("delivery-charge").textContent = deliveryCharge.toLocaleString('en-BD');

    // Check if any product weight selected
    if (orderBody.innerHTML === "") {
        document.getElementsByClassName("order-details")[0].style.display = "none";
        floatButton.classList.add('hidden'); // Hide the button
    } else {
        document.getElementsByClassName("order-details")[0].style.display = "block";
        // observer.observe(formContainer); // Observe the form container
        floatButton.classList.remove('hidden'); // Hide the button
    }

    // Update floating order button
    floatButton.innerHTML = `
        <span class="text title">Confirm<br>Order</span>
        <span class="text price">Total<br>৳${totalPrice.toLocaleString('en-BD')}</span>
    `

    // Update payment process
    updatePaymentProcess(totalPrice);
}

// Order confirmation form
const phoneInput = document.getElementById('id_phone');
const form = document.getElementById('order-form');
const modal = document.getElementById('invalid-phone-modal');
const closeModalButton = document.getElementById('close-modal');

// Regex for phone number validation
const phoneRegex = /^(?:\+880|880|0)\d{10}$/;

const formFields = form.querySelectorAll('#id_name, #id_phone, #id_division, #id_address');
formFields.forEach(field => {
    field.addEventListener('input', () => {
        console.log(`${field.name} value changed to: ${field.value}`);

        switch (field.name) {
            case 'name':
                // Name validation
                if (field.value.length >= 1) {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                } else {
                    field.classList.remove('valid');
                }
                break;
            case 'phone':
                let phone_number = field.value.replace(/[- ]/g, '');
                phoneInput.value = phone_number;
                // Phone number validation
                if (phoneRegex.test(phone_number)) {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                } else {
                    field.classList.remove('valid');
                    field.classList.add('invalid');
                }
                break;
            case 'division':
                // Division validation
                if (field.value !== '') {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                } else {
                    field.classList.remove('valid');
                }
                break;
            case 'address':
                // Address validation
                if (field.value.length >= 1) {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                } else {
                    field.classList.remove('valid');
                }
                break;
        }
    });

    field.addEventListener('focus', () => {
        console.log(`Focused on ${field.name}`);
    });

    field.addEventListener('blur', () => {
        console.log(`Left ${field.name}`);
    });
});

// Form submission
form.addEventListener('submit', function (event) {
    console.log('Form submitted');
    event.preventDefault();

    // Final phone number validation before submission
    if (!phoneRegex.test(phoneInput.value)) {
        // phoneInput.focus();
        modal.style.display = 'flex'; // Show modal
        document.body.style.overflow = 'hidden'; // Disable scrolling
        return;
    }

    // Show loading animation
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.display = 'block';
    form.style.opacity = '0.3';

    // Finally submit the form to the server
    form.submit()

    // Hide the loading animation and show the form just before leaving the page
    window.addEventListener('beforeunload', () => {
        // Hide loading animation
        loadingAnimation.style.display = 'none';
        form.style.opacity = '1';
        // Clear cartList from localStorage
        localStorage.removeItem('cartList');
    });
});

// Close the modal when clicking the close button
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
});

// Close the modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
});

// Payment method
const paymentInfo = document.getElementById('payment-info');
const radios = document.querySelectorAll('input[name="payment_method"]');
const formContainer = document.getElementById('form-container');

/**
 * @param {number} totalAmount - Total amount to be paid
 */
// Function to update payment process based on the selected option
function updatePaymentProcess(totalAmount) {
    const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;

    if (selectedMethod === "Cash on Delivery") {
        formContainer.classList.remove('flowers'); // Remove flower style
        paymentInfo.innerHTML = `
                <strong>Cash on Delivery:</strong><br>
                You will pay <strong>${totalAmount.toLocaleString('en-BD')}</strong> in cash when the product is delivered to your address.
            `;
    } else if (selectedMethod === "Bkash") {
        formContainer.classList.add('flowers'); // Add flower style
        const discount = totalAmount * 0.05; // Calculate 5% discount
        const discountedAmount = totalAmount - discount;
        paymentInfo.innerHTML = `
                <strong>Bkash:</strong><br>
                Send payment to our Bkash merchant number <strong>017XXXXXXXX</strong>. Include your order ID in the payment reference.<br><br>
                <div class="discount-table">
                    <div class="row">
                        <div class="description">Total Amount</div>
                        <div class="amount">${totalAmount.toLocaleString('en-BD')}</div>
                    </div>
                    <div class="row">
                        <div class="description">Discount (5%)</div>
                        <div class="amount">-${discount.toLocaleString('en-BD')}</div>
                    </div>
                    <div class="row">
                        <div class="description final-row">Amount to Pay</div>
                        <div class="amount final-row">${discountedAmount.toLocaleString('en-BD')}</div>
                    </div>
                </div>
            `;
    }
}

// Attach event listener to each radio button
radios.forEach(radio => {
    // radio.addEventListener('change', updatePaymentProcess);
    radio.addEventListener('change', populateOrderTable);
});

// Initialize with the default selected option
// updatePaymentProcess();

// Floating order confirmation button
const floatButton = document.getElementById('floatOrderConfirmButton');

// Function to handle button visibility based on section visibility
const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                floatButton.classList.add('hidden'); // Hide the button
            } else {
                const orderBody = document.getElementById("order-body");
                if (orderBody.innerHTML.trim() !== "") {
                    floatButton.classList.remove('hidden'); // Show the button
                }
            }
        });
    }, {threshold: 0.5} // Trigger when 50% of the section is visible
);

// Observe the specific section
observer.observe(formContainer);

// Add an event listener for the button click
floatButton.addEventListener('click', () => {
    form.scrollIntoView({behavior: 'smooth'}); // Scroll to the form
    setTimeout(() => {
        document.getElementById('submit-button').click(); // Simulate form submission
    }, 500)
});