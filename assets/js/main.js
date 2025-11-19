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

// --------- Navbar theme switch --------- //
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("[data-theme]");
  const navbarCta = document.querySelector(".navbar__cta");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY + 0; // simulate “80px from top”
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionBottom = sectionTop + rect.height;

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        const currentTheme = section.getAttribute("data-theme");
        navbar.classList.remove("light-theme", "dark-theme");
        navbar.classList.add(`${currentTheme}-theme`);
        if (section.id === "waitlist") {
          navbarCta.textContent = "Follow us  ( LI ) & ( x )";
          navbarCta.href = "#footer";
        } else {
          navbarCta.textContent = "JOIN THE WAITLIST";
          navbarCta.href = "#waitlist";
        }
      }
    });
  });
});

// Initialize Features Swiper
const featuresSwiper = new Swiper(".features__slider", {
  slidesPerView: 1,
  spaceBetween: 16,
  centeredSlides: false,
  pagination: {
    el: ".features__pagination",
    clickable: true,
  },

  breakpoints: {
    768: {
      slidesPerView: 3,
      spaceBetween: 12,
      centeredSlides: false,
      grid: {
        fill: "row",
        rows: 2,
      },
    },
  },
});

// Features Popup Functionality
const featuresPopup = document.querySelector(".features__popup");
const featuresCards = document.querySelectorAll(".features__card");
const popupClose = document.querySelector(".features__popup-close");

const popupIconContainer = document.querySelector(".features__popup-icon");
const popupTitle = document.querySelector(".features__popup-title");
const popupDescription = document.querySelector(".features__popup-description");
const popupTag = document.querySelector(".features__popup-tag");

function openPopup(icon, title, description, tag) {
  // Clone the SVG from the card and inject into popup
  popupIconContainer.innerHTML = "";
  if (icon) {
    popupIconContainer.appendChild(icon.cloneNode(true));
  }
  popupTitle.textContent = title;
  popupDescription.textContent = description;
  if (tag) {
    popupTag.textContent = tag.textContent;
    popupTag.style.display = "block";
  }
  featuresPopup.hidden = false;
  // Force reflow
  featuresPopup.offsetHeight;
  featuresPopup.classList.add("is-visible");
  document.body.style.overflow = "clip";
}

function closePopup() {
  featuresPopup.classList.remove("is-visible");
  document.body.style.overflow = "";
  setTimeout(() => {
    featuresPopup.hidden = true;
  }, 300);
}

featuresCards.forEach((card) => {
  card.addEventListener("click", () => {
    const iconSvg = card.querySelector(".features__icon svg");
    const title = card.querySelector(".h9, h3").textContent;
    const description = card.querySelector(".features__card-description").textContent;
    const tag = card.querySelector(".tag");
    openPopup(iconSvg, title, description, tag);
  });
});

popupClose.addEventListener("click", closePopup);

featuresPopup.addEventListener("click", (e) => {
  if (e.target === featuresPopup) {
    closePopup();
  }
});

// Waitlist Form Handling
const waitlistForm = document.getElementById("waitlistForm");

// Validation functions
const validators = {
  firstName: (value) => ({
    isValid: value.trim().length >= 2 && value.trim().length <= 40,
    message: "Please enter your first name",
  }),
  lastName: (value) => ({
    isValid: value.trim().length >= 2 && value.trim().length <= 40,
    message: "Please enter your last name",
  }),
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: "Please enter a valid email address",
    };
  },
  bmsName: (value) => ({
    isValid: (value !== "" && value !== "Other") || document.getElementById("otherBmsField").querySelector("input").value.trim() !== "",
    message: "Please select BMS you are using or specify your BMS",
  }),
};

// Show error for a field
function showError(input, message) {
  const field = input.parentElement;
  field.classList.add("form__field--error");

  // Remove any existing error message
  const existingError = field.querySelector(".form__field__error");
  if (existingError) {
    existingError.remove();
  }

  // Add error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "form__field__error";
  errorDiv.textContent = message;
  field.appendChild(errorDiv);
}

// Clear error for a field
function clearError(input) {
  const field = input.parentElement;
  field.classList.remove("form__field--error");
  const errorDiv = field.querySelector(".form__field__error");
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Validate a single field
function validateField(input) {
  const value = input.value;
  const validatorName = input.name || input.getAttribute("data-validate");

  if (validators[validatorName]) {
    const { isValid, message } = validators[validatorName](value);
    if (!isValid) {
      showError(input, message);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }
  return true;
}

// Setup real-time validation
waitlistForm.querySelectorAll(".form__field__input").forEach((input) => {
  // Clear error on input
  input.addEventListener("input", () => {
    clearError(input);
  });
});

// Handle BMS "Other" option
const bmsSelect = document.getElementById("bmsSelect");
const otherBmsField = document.getElementById("otherBmsField");

bmsSelect.addEventListener("change", () => {
  if (bmsSelect.value === "Other") {
    otherBmsField.style.display = "block";
    otherBmsField.querySelector("input").required = true;
    // Trigger validation on the BMS select when other input changes
    otherBmsField.querySelector("input").addEventListener("input", () => {
      validateField(bmsSelect);
    });
  } else {
    otherBmsField.style.display = "none";
    otherBmsField.querySelector("input").required = false;
    otherBmsField.querySelector("input").value = "";
    clearError(bmsSelect);
  }
});

// Form submission
waitlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;
  const formFields = waitlistForm.querySelector(".form__fields");
  const successMessage = waitlistForm.querySelector(".success__message");
  const submitButton = waitlistForm.querySelector(".waitlist__form__submit");

  // Validate all fields
  waitlistForm.querySelectorAll(".form__field__input").forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  try {
    submitButton.textContent = "Submitting...";
    submitButton.disabled = true;

    // Simulate API call - Replace with actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success state
    waitlistForm.classList.add("waitlist__form--success");
    submitButton.textContent = "Successfully registered";
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = "Join the Waitlist";
    console.error("Form submission error:", error);
  }
});

/* Footer height calculate for linear gradient background */

const footer = document.querySelector("footer");
const root = document.documentElement;

function updateFooterHeight() {
  root.style.setProperty("--footer-height", `${footer.offsetHeight}px`);
}

updateFooterHeight();
window.addEventListener("resize", updateFooterHeight);
