axios.defaults.baseURL = 'http://jazakallah.store';

export function fbEvent(eventParams) {
    const event_name = eventParams.event_name;
    axios.post("/event/", {"data": eventParams})
        .then((response) => {
            console.log("Data successfully sent:", response.data);
            // set server send data
            eventParams.event_id = response.data.event_id;
            eventParams.user_data.client_ip_address = response.data.client_ip_address;

            // Send the event to Facebook Pixel
            const pixelResponse =  fbq('track', event_name, eventParams.custom_data, {"event_id": eventParams.event_id});
            console.log(pixelResponse)
        })
        .catch((error) => {
            console.error("Error sending data:", error);
        });
}