import {getCookieValue} from "../../static/cookie_handler.js";
import {fbEvent} from "../../static/event_manager.js";

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
    let contents = [];
    Object.keys(oderDetails).forEach(productId => {
        const {weight, price} = oderDetails[productId];
        if (weight > 0) {
            subTotal += price * weight;
        }
        content_ids.push(productId);
        contents.push({
            'id': productId,
            'quantity': weight,
            'item_price': price
        });
    });


    const payload = {
        "event_name": "Purchase",
        "event_time": Math.floor(Date.now() / 1000),
        "action_source": "website",
        "event_id": null,
        "event_source_url": window.location.href,
        "user_data": {
            "client_ip_address": null,
            "client_user_agent": navigator.userAgent,
            "fbc": getCookieValue('_fbc'),
            "fbp": getCookieValue('_fbp')
        },
        "custom_data": {
            "currency": "USD",
            "value": (subTotal/121).toFixed(2),
            "content_category": "Organic Food",
            "content_ids": content_ids,
            // "content_name": product.name,
            "contents": contents,
            "content_type": "product",
            "num_items": content_ids.length,
            "predicted_ltv": subTotal
        }
    };

    const customerDetails = JSON.parse(document.getElementById('customer-details').textContent.trim().replace(/'/g, '"'));
    const {name, phone, address} = customerDetails;
    for (let key in customerDetails) {
        if (customerDetails[key] !== "") {
            payload.user_data[key] = customerDetails[key];
        }
    }

    fbEvent(payload);
}

document.addEventListener("DOMContentLoaded", function () {
    sendPurchaseEvent();
});

