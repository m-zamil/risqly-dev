const toggleButton = document.querySelector(".navbar__toggle");
const overlay = document.getElementById("menuOverlay");
const closeButton = document.querySelector(".menu-overlay__close");
const navbar = document.querySelector(".navbar");

// Hamburger Menu
toggleButton.addEventListener("click", () => {
  overlay.style.display = "block";
  document.body.style.overflow = "hidden"; // prevent background scroll
});

closeButton.addEventListener("click", () => {
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
});

// Close overlay if clicked outside content
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Sticky Navbar on Scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});
