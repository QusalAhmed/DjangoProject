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