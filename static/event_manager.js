axios.defaults.baseURL = 'https://jazakallah.store/';
// Set CSRF token in Axios defaults
axios.defaults.headers.common['X-CSRFToken'] = getCSRFToken();

export function fbEvent(eventParams) {
    const event_name = eventParams.event_name;
    axios.post("/event/", {"data": eventParams})
        .then((response) => {
            console.log("Data successfully sent:", response.data);
            // set server send data
            eventParams.event_id = response.data.event_id;
            eventParams.user_data.client_ip_address = response.data.client_ip_address;

            // Send the event to Facebook Pixel
            fbq('track', event_name, eventParams.custom_data, {"event_id": eventParams.event_id});
        })
        .catch((error) => {
            console.error("Error sending data:", error);
        });
}

// Function to get CSRF token from cookies
function getCSRFToken() {
    const cookies = document.cookie.split('; ');
    const csrfCookie = cookies.find(cookie => cookie.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
}
