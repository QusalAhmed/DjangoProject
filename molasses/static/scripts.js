import {getCookieValue} from "../../static/cookie_handler.js";
import {fbEvent} from "../../static/event_manager.js";


// Parse product data from the embedded script tag
const productData = JSON.parse(document.getElementById('product-data').textContent.trim().replace(/'/g, '"'));

// Prevent copying
const quantity_buttons = document.querySelectorAll('.quantity-btn');
quantity_buttons.forEach(quantity_button => {
    quantity_button.addEventListener('copy', (event) => {
        event.preventDefault();
    });
});

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
    showToast();

    // Update the invoice table
    populateOrderTable();

    // Fb event
    if (change > 0 && productWeights[productId].weight === 1) {
        const payload = {
            "event_name": "AddToCart",
            "event_time": Math.floor(Date.now() / 1000),
            "action_source": "website",
            "event_id": null,
            "event_source_url": "https://jazakallah.store/",
            "user_data": {
                "client_ip_address": null,
                "client_user_agent": navigator.userAgent,
                "fbc": getCookieValue('_fbc'),
                "fbp": getCookieValue('_fbp')
            },
            "custom_data": {
                "currency": "BDT",
                "value": product.price,
                "content_category": "Organic Food",
                "content_ids": [productId],
                "content_name": product.name,
                // "contents": productWeights[productId],
                "content_type": "product",
                "num_items": 1,
                "predicted_ltv": product.price * 2
            }
        }
        fbEvent(payload);
    }
}

// Add to the global scope
window.updateWeight = updateWeight;

function updateCartCounter(cartCount) {
    const cartCounter = document.getElementById('cart-count');
    cartCounter.textContent = cartCount.toString();
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
window.productWeights = productWeights;
$(document).ready(function () {
    console.log('DOM fully loaded and parsed');
    // Close the loading screen
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.display = 'none';
    form.style.opacity = '1';

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
            generateDigits(document.querySelector(`#quantity-${product.id}`), 1000);
        });
        localStorage.setItem('cartList', JSON.stringify(productWeights));
    }

    // Set direction parameter
    const urlParams = new URLSearchParams(window.location.search);
    const direction = urlParams.get('q');
    if (direction === 'up') {
        const page_visit_dir = document.querySelector('.page-visit a');
        page_visit_dir.href = 'https://www.facebook.com/khejurerkhatigur/'

        const message_dir = document.querySelector('.message a');
        message_dir.href = 'https://www.m.me/100607855847086'
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
    let cartCount = 0;
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

        // Calculate cart items
        cartCount += weight;
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

    // Update cart counter
    updateCartCounter(cartCount);
}

// Order confirmation form
const phoneInput = document.getElementById('id_phone');
const form = document.getElementById('order-form');
const modal = document.getElementById('invalid-phone-modal');
const closeModalButton = document.getElementById('close-modal');

phoneInput.addEventListener("input", () => {
    // Clear any previous custom validation message when the user starts typing
    phoneInput.setCustomValidity("");
});

phoneInput.addEventListener("invalid", () => {
    // Set a custom validation message when the input is invalid
    phoneInput.setCustomValidity("ফোন নাম্বার লিখুন");
});

// Regex for phone number validation
const phoneRegex = /^(?:\+8801|8801|01)\d{9}$/;

const formFields = form.querySelectorAll('#id_name, #id_phone, #id_division, #id_address, #id_comment');
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
                // Fb initial checkout event
                initCheckout();

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

            case 'comment':
                // Comment validation
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
    event.preventDefault();

    // Final phone number validation before submission
    if (!phoneRegex.test(phoneInput.value)) {
        // Wait for the scroll to finish
        setTimeout(() => {
            phoneInput.scrollIntoView({behavior: 'smooth', block: 'center'}); // Scroll to the phone input
        }, 100);
        modal.style.display = 'flex'; // Show modal
        document.body.style.overflow = 'hidden'; // Disable scrolling
        return;
    }

    // Show loading animation
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.display = 'block';
    form.style.opacity = '0.3';

    // JavaScript to add dynamic data to the input (order details)
    const orderDetailsInput = document.getElementById('id_order_details');
    orderDetailsInput.value = JSON.stringify(productWeights);

    // JavaScript to add dynamic data to the input (delivery charge)
    const deliveryChargeInput = document.getElementById('id_delivery_charge');
    deliveryChargeInput.value = deliveryCharge;

    // Finally submit the form to the server
    form.submit()

    // Clear cartList from localStorage
    localStorage.removeItem('cartList');

    // Hide the loading animation when back to the page
    window.addEventListener('pageshow', () => {
        // Hide loading animation
        loadingAnimation.style.display = 'none';
        form.style.opacity = '1';
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
                <strong>
                Cash on Delivery: <i class="fa-solid fa-truck"> </i> <i class="fa-solid fa-sack-dollar"></i>
                </strong><br>
                You will pay <strong>৳ ${totalAmount.toLocaleString('en-BD')}</strong> 
                in cash when the product is delivered to your address.
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

    // Fb initial checkout event
    initCheckout();
});

let initialCheckout = false;

function initCheckout() {
    if (initialCheckout) return; // If the event is already sent, exit the function
    const contents = []
    Object.keys(productWeights).forEach(productId => {
        const {weight, price} = productWeights[productId];
        if (weight <= 0) return {}; // Skip items with no weight
        contents.push({
            'id': productId,
            'quantity': weight,
            'item_price': price
        });
    });
    const subTotal = Object.keys(productWeights).reduce((acc, productId) => {
        const {weight, price} = productWeights[productId];
        console.log(acc, price, weight);
        return acc + price * weight;
    }, 0);
    if (contents.length === 0) return; // If no product is selected, exit the function
    console.log("Initiating checkout with contents: ", contents);
    fbEvent({
        "event_name": "InitiateCheckout",
        "event_time": Math.floor(Date.now() / 1000),
        "action_source": "website",
        "event_id": null,
        "event_source_url": "https://jazakallah.store/",
        "user_data": {
            "client_ip_address": null,
            "client_user_agent": navigator.userAgent,
            "fbc": getCookieValue('_fbc'),
            "fbp": getCookieValue('_fbp')
        },
        "custom_data": {
            "currency": "BDT",
            "value": subTotal,
            "content_category": "Organic Food",
            "content_ids": Object.keys(productWeights),
            "contents": contents,
            "content_type": "product",
            "num_items": Object.keys(productWeights).length,
            "predicted_ltv": subTotal
        }
    })
    initialCheckout = true;
}

// Order details copy button
function copyText() {
    let orderDetails = ''
    let subTotal = 0;
    Object.keys(productWeights).forEach(productId => {
        const {weight, name, price} = productWeights[productId];
        if (weight > 0) {
            orderDetails += `${name}: ${weight} Kg\n`;
            subTotal += price * weight;
        }
    });
    // Get the text content
    const textToCopy = orderDetails + `Subtotal: ৳${subTotal.toLocaleString('en-BD')}`;

    // Copy the text to the clipboard
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Change button text and style
        const copyButton = document.getElementById("copy-button");
        copyButton.textContent = "Copied!";
        copyButton.classList.add("copied");

        // Reset button text and style after 2 seconds
        setTimeout(() => {
            copyButton.textContent = "Copy Order Details";
            copyButton.classList.remove("copied");
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });

    // Fb custom event
    fbq('trackCustom', 'InterestOnProduct', {
        content: orderDetails,
        value: subTotal,
        currency: 'BDT'
    });
}

window.copyText = copyText;

// Product heading
function toggleSlide() {
    let slideHeight = 0;
    const slideSection = document.getElementById('slide-section');
    // Set height of slideSection
    slideHeight = slideSection.scrollHeight;
    slideSection.style.height = slideSection.classList.contains('active') ? 0 : `${slideHeight}px`;
    slideSection.style.paddingBlock = slideSection.classList.contains('active') ? 0 : '5px';
    slideSection.classList.toggle('active');

    if (slideSection.classList.contains('active')) {
        let slideInterval = setInterval(() => {
            const slideSection = document.getElementById('slide-section');
            if (slideHeight === slideSection.scrollHeight) {
                clearInterval(slideInterval);
            }
            slideHeight = slideSection.scrollHeight;
            slideSection.style.height = slideHeight + 'px';
            slideSection.style.paddingBlock = '5px';
        }, 200);
    } else {
        slideSection.style.height = '0';
        slideSection.style.paddingBlock = '0';
    }
}

window.toggleSlide = toggleSlide;

// Send Fb event when message or call button clicked
const contactButtons = document.querySelectorAll('.fb-contact');
contactButtons.forEach(button => {
    button.addEventListener('click', () => {
        fbq('track', 'Contact');
    });
});

// Go to order button
$('.order-btn').click(function () {
    $('html, body').animate({
        scrollTop: $('.product-heading-container').offset().top
    }, 1000);
});

// selected-weights toast
const toast = document.getElementById('selected-weights');
let toastTimeout;

const showToast = () => {
    // Make toast visible
    toast.classList.add('visible');

    // Clear any existing timeout to reset the countdown
    clearTimeout(toastTimeout);

    // Set timeout to hide toast after 1 second
    toastTimeout = setTimeout(() => hideToast(), 2000);
};

const hideToast = () => {
    toast.classList.remove('visible');
};

// Prevent leaving the page
// window.onload = function () {
//     history.replaceState({state: 1}, `State 1`, `?state=1`);
//     setInterval(function () {
//         const urlParams = new URLSearchParams(window.location.search);
//         let state = urlParams.get('state');
//         if (state >= 10) return;
//         history.pushState({state: ++state}, `State ${state}`, `?state=${state}`);
//     }, 100);
// }