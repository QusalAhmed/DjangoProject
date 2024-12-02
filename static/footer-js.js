// footer_animation.js

// Function to add the fade-in animation class after the page loads
window.addEventListener("load", function() {
    const footer = document.getElementById("footer");
    footer.classList.add("show-footer");
});


// Function to add the fade-in animation class when the footer enters the viewport
window.addEventListener("scroll", function() {
    const footer = document.getElementById("footer");
    const footerPosition = footer.getBoundingClientRect().top;  // Get footer's position relative to the viewport
    const windowHeight = window.innerHeight;  // Height of the viewport

    // If the footer is visible in the viewport
    if (footerPosition < windowHeight) {
        footer.classList.add("show-footer");
    }
});
