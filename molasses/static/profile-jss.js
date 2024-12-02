// Customer Data with order details (expanded to include products, quantity, and price)
const customer = {
    name: "John Doe",
    phone: "+1234567890",
    orders: [
        {
            orderId: "A123",
            date: "2024-10-15",
            total: "$50.00",
            status: "Pending",
            items: [
                {product: "Laptop", quantity: 1, price: "$50.00"}
            ]
        },
        {
            orderId: "B456",
            date: "2024-09-30",
            total: "$120.00",
            status: "Delivered",
            items: [
                {product: "Headphones", quantity: 2, price: "$30.00"},
                {product: "USB Cable", quantity: 1, price: "$15.00"}
            ]
        },
        {
            orderId: "C789",
            date: "2024-08-21",
            total: "$75.50",
            status: "Delivered",
            items: [
                {product: "Smartphone", quantity: 1, price: "$75.50"}
            ]
        }
    ]
};

// Function to populate customer information and order history
function displayCustomerInfo() {
    // Display customer name and phone number
    document.getElementById('customer-name').textContent = customer.name;
    document.getElementById('customer-phone').textContent = customer.phone;

    // Populate order history table
    const orderTableBody = document.querySelector("#order-table tbody");
    customer.orders.forEach(order => {
        const row = document.createElement("tr");

        const orderIdCell = document.createElement("td");
        orderIdCell.textContent = order.orderId;

        const orderDateCell = document.createElement("td");
        orderDateCell.textContent = order.date;

        const orderTotalCell = document.createElement("td");
        orderTotalCell.textContent = order.total;

        const orderStatusCell = document.createElement("td");
        orderStatusCell.textContent = order.status;

        const orderDetailsCell = document.createElement("td");
        const detailsButton = document.createElement("button");
        detailsButton.textContent = "Show Details";
        detailsButton.onclick = () => toggleOrderDetails(order, row);
        orderDetailsCell.appendChild(detailsButton);

        row.appendChild(orderIdCell);
        row.appendChild(orderDateCell);
        row.appendChild(orderTotalCell);
        row.appendChild(orderStatusCell);
        row.appendChild(orderDetailsCell);

        orderTableBody.appendChild(row);
    });
}

// Toggle displaying the order details row
function toggleOrderDetails(order, row) {
    let detailsRow = row.nextElementSibling;
    if (detailsRow && detailsRow.classList.contains("order-details")) {
        detailsRow.remove(); // Hide the details if already shown
    } else {
        // Create a new row for order details
        detailsRow = document.createElement("tr");
        detailsRow.classList.add("order-details");
        const detailsCell = document.createElement("td");
        detailsCell.colSpan = 5;

        // Create a detailed list of order items
        let detailsContent = "<ul>";
        order.items.forEach(item => {
            detailsContent += `<li>${item.quantity} x ${item.product} - ${item.price}</li>`;
        });
        detailsContent += "</ul>";

        detailsCell.innerHTML = detailsContent;
        detailsRow.appendChild(detailsCell);

        row.parentNode.insertBefore(detailsRow, row.nextElementSibling); // Insert the details below the current row
    }
}

// Initialize the page by displaying customer info
displayCustomerInfo();