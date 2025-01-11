import {send_tracking_data} from './event_manager.js';

document.addEventListener('DOMContentLoaded', function () {
    // Scroll tracking
    let isScrolling;
    window.addEventListener("scroll", () => {
        // Clear the timeout if scrolling continues
        clearTimeout(isScrolling);
        // Set a timeout to detect when scrolling stops
        isScrolling = setTimeout(() => {
            const scrollPosition = window.scrollY; // Current scroll position
            console.log(`Scroll ended at position: ${scrollPosition.toFixed(0)}px`);
            const sections = document.querySelectorAll('[id]');
            sections.forEach(section => {
                observer.observe(section);
            });
        }, 200); // 200ms timeout after scroll stops
    });

    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get z-index of the element
                const zIndex = window.getComputedStyle(entry.target).getPropertyValue('z-index');
                if (zIndex === 'auto') {
                    // Content of the element
                    const content = entry.target.innerText.trim();
                    console.log(`Visible element: ${entry.target.id} with content: ${content}`);
                    send_tracking_data(`Visible element: ${entry.target.id} with content: ${content}`);
                }
            }
        });
    }, {
        threshold: 0.5 // Element must be at least 50% visible
    });


    // Button click tracking
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.innerText.trim();
            send_tracking_data(`Button clicked: ${buttonText}`);
        });
    });
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            const buttonText = button.innerText.trim();
            send_tracking_data(`Button touched: ${buttonText}`);
        });
    });


    // Play audion on button click
    const audio = new Audio('static/audio/purchase button click.wav');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            audio.play().then(() => console.log('Audio played'));
        });
    });

    // Link click tracking
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            const linkText = link.innerText.trim();
            send_tracking_data(`Link clicked: ${linkText}`);
        });
    });

    // Image load tracking
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        image.addEventListener('load', () => {
            send_tracking_data(`Image loaded: ${image.src}`);
        });
    });

    // Form submission tracking
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const formValues = Object.fromEntries(formData.entries());
            send_tracking_data(`Form submitted with values: ${JSON.stringify(formValues)}`);
        });
    });

    // Mouse movement tracking
    // document.addEventListener('mousemove', (event) => {
    //     const x = event.clientX;
    //     const y = event.clientY;
    //     send_tracking_data(`Mouse moved to: (${x}, ${y})`);
    // });

    // Key press tracking
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        send_tracking_data(`Key pressed: ${key}`);
    });

    // Page visibility tracking
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            send_tracking_data('Page is hidden');
        } else {
            send_tracking_data('Page is visible');
        }
    });

    // Network status tracking
    window.addEventListener('offline', () => {
        send_tracking_data('Network is offline');
    });

    window.addEventListener('online', () => {
        send_tracking_data('Network is online');
    });

    // Device orientation tracking
    window.addEventListener('deviceorientation', (event) => {
        const alpha = event.alpha;
        const beta = event.beta;
        const gamma = event.gamma;
        send_tracking_data(`Device orientation: alpha=${alpha}, beta=${beta}, gamma=${gamma}`);
    });

    // Geolocation tracking
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        send_tracking_data(`Current position: latitude=${latitude}, longitude=${longitude}`);
    });
});