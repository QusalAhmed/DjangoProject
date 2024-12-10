// Get the button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
// Show the button when the user reaches the bottom of the page
window.onscroll = function () {
    // Check if the user is at the bottom of the page
    if (document.documentElement.scrollHeight - (window.innerHeight + window.scrollY) <= 50) {
        scrollToTopBtn.style.display = "flex"; // Show the button
    } else {
        scrollToTopBtn.style.display = "none"; // Hide the button
    }
};

// When the user clicks on the button, scroll to the top of the document
scrollToTopBtn.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Smooth scroll
    });
};