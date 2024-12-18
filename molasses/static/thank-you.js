// Order details copy button
function copyText() {
    const oderDetails = JSON.parse(document.getElementById('order-details').textContent.trim().replace(/'/g, '"'));
    let textToCopy = ''
    let subTotal = 0;
    Object.keys(oderDetails).forEach(productId => {
        const {weight, name, price} = oderDetails[productId];
        if (weight > 0) {
            textToCopy += `${name}: ${weight} Kg\n`;
            subTotal += price * weight;
        }
    });
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
}

// Send purchase event to Facebook Pixel
function sendPurchaseEvent() {
    const oderDetails = JSON.parse(document.getElementById('order-details').textContent.trim().replace(/'/g, '"'));
    let subTotal = 0;
    let content_ids = [];
    Object.keys(oderDetails).forEach(productId => {
        const {weight, price} = oderDetails[productId];
        if (weight > 0) {
            subTotal += price * weight;
        }
        content_ids.push(productId);
    });
    const fbc = getCookieValue('_fbc');
    const fbp = getCookieValue('_fbp');
    fbq('track', 'Purchase', {
        content_ids: content_ids,
        content_type: 'product',
        contents: oderDetails,
        num_items: content_ids.length,
        value: subTotal,
        currency: 'USD',
        fbc: fbc,
        fbp: fbp
    });
}

document.addEventListener("DOMContentLoaded", function () {
    sendPurchaseEvent();
});

function getCookieValue(cookieName) {
    const match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    return match ? match[2] : null;
}