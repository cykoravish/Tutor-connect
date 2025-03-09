// navbar
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
  });

  // Hamburger menu functionality
  const hamburger = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const navButtons = document.querySelectorAll(".nav-btn");

  // Add animation delay variables to menu items
  [...navLinks, ...navButtons].forEach((item, index) => {
    item.style.setProperty("--i", index + 1);
  });

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Toggle body scroll
    document.body.style.overflow = navMenu.classList.contains("active")
      ? "hidden"
      : "auto";
  });

  // Close menu when clicking on a nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // Add active class to current section in navbar
  function highlightNavLink() {
    const sections = document.querySelectorAll("section");
    const scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // Highlight active nav link on scroll
  window.addEventListener("scroll", highlightNavLink);

  // Add scroll animation to header
  const header = document.querySelector("header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
      header.style.background =
        "linear-gradient(135deg, rgba(26, 38, 52, 0.95), rgba(15, 25, 34, 0.95))";
      header.style.backdropFilter = "blur(10px)";
    } else {
      header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
      header.style.background = "linear-gradient(135deg, #1a2634, #0f1922)";
      header.style.backdropFilter = "none";
    }

    lastScrollTop = scrollTop;
  });
});

// slider
document.addEventListener("DOMContentLoaded", () => {
  // Custom Carousel Implementation
  class CustomCarousel {
    constructor(element, options = {}) {
      // Main elements
      this.carouselContainer = element;
      this.slidesContainer = element.querySelector('.slides-container');
      this.slides = Array.from(this.slidesContainer.children);
      this.totalSlides = this.slides.length;
      
      // Options with defaults
      this.options = {
        autoplay: options.autoplay !== undefined ? options.autoplay : true,
        autoplaySpeed: options.autoplaySpeed || 5000,
        animationSpeed: options.animationSpeed || 600,
        ...options
      };
      
      // State
      this.currentIndex = 0;
      this.autoplayTimer = null;
      this.isTransitioning = false;
      
      // Initialize
      this.init();
    }
    
    init() {
      // Set up the carousel structure
      this.setupStructure();
      
      // Create navigation and pagination
      this.createControls();
      
      // Set initial slide
      this.goToSlide(0);
      
      // Start autoplay if enabled
      if (this.options.autoplay) {
        this.startAutoplay();
      }
      
      // Add event listeners
      this.addEventListeners();
    }
    
    setupStructure() {
      // Add necessary classes
      this.carouselContainer.classList.add('custom-carousel');
      this.slidesContainer.classList.add('slides-wrapper');
      
      // Set up slides
      this.slides.forEach((slide, index) => {
        slide.classList.add('carousel-slide');
        slide.dataset.index = index;
        slide.style.display = 'none';
        
        // Prepare content elements for animation
        const contentElements = slide.querySelectorAll('.slide-subtitle, .slide-title, .slide-description, .slide-button');
        contentElements.forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
      });
    }
    
    createControls() {
      // Create navigation buttons
      const prevButton = document.createElement('button');
      prevButton.className = 'carousel-prev';
      prevButton.innerHTML = '&#10094;';
      prevButton.setAttribute('aria-label', 'Previous slide');
      
      const nextButton = document.createElement('button');
      nextButton.className = 'carousel-next';
      nextButton.innerHTML = '&#10095;';
      nextButton.setAttribute('aria-label', 'Next slide');
      
      // Create pagination
      const pagination = document.createElement('div');
      pagination.className = 'carousel-pagination';
      
      for (let i = 0; i < this.totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'pagination-dot';
        dot.dataset.index = i;
        pagination.appendChild(dot);
      }
      
      // Append controls to carousel
      this.carouselContainer.appendChild(prevButton);
      this.carouselContainer.appendChild(nextButton);
      this.carouselContainer.appendChild(pagination);
      
      // Store references
      this.prevButton = prevButton;
      this.nextButton = nextButton;
      this.pagination = pagination;
      this.dots = Array.from(pagination.children);
    }
    
    addEventListeners() {
      // Navigation buttons
      this.prevButton.addEventListener('click', () => this.prevSlide());
      this.nextButton.addEventListener('click', () => this.nextSlide());
      
      // Pagination dots
      this.dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.dataset.index);
          this.goToSlide(index);
        });
      });
      
      // Pause autoplay on hover
      this.carouselContainer.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.carouselContainer.addEventListener('mouseleave', () => this.resumeAutoplay());
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
        }
      });
    }
    
    goToSlide(index) {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      
      // Hide current slide
      if (this.slides[this.currentIndex]) {
        const currentSlide = this.slides[this.currentIndex];
        this.hideSlideContent(currentSlide);
        
        setTimeout(() => {
          currentSlide.style.display = 'none';
        }, 300);
      }
      
      // Update current index
      this.currentIndex = index;
      
      // Show new slide
      setTimeout(() => {
        // Update active dot
        this.dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === this.currentIndex);
        });
        
        const activeSlide = this.slides[this.currentIndex];
        activeSlide.style.display = 'block';
        
        // Animate content with delay
        setTimeout(() => {
          this.showSlideContent(activeSlide);
          this.isTransitioning = false;
        }, 50);
      }, 350);
    }
    
    nextSlide() {
      const nextIndex = (this.currentIndex + 1) % this.totalSlides;
      this.goToSlide(nextIndex);
    }
    
    prevSlide() {
      const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
      this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
      if (this.options.autoplay) {
        this.autoplayTimer = setInterval(() => {
          this.nextSlide();
        }, this.options.autoplaySpeed);
      }
    }
    
    pauseAutoplay() {
      clearInterval(this.autoplayTimer);
    }
    
    resumeAutoplay() {
      if (this.options.autoplay) {
        this.startAutoplay();
      }
    }
    
    hideSlideContent(slide) {
      const elements = slide.querySelectorAll('.slide-subtitle, .slide-title, .slide-description, .slide-button');
      elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
      });
    }
    
    showSlideContent(slide) {
      const subtitle = slide.querySelector('.slide-subtitle');
      const title = slide.querySelector('.slide-title');
      const description = slide.querySelector('.slide-description');
      const button = slide.querySelector('.slide-button');
      
      // Staggered animations
      setTimeout(() => {
        if (subtitle) {
          subtitle.style.opacity = '1';
          subtitle.style.transform = 'translateY(0)';
        }
      }, 100);
      
      setTimeout(() => {
        if (title) {
          title.style.opacity = '1';
          title.style.transform = 'translateY(0)';
        }
      }, 300);
      
      setTimeout(() => {
        if (description) {
          description.style.opacity = '1';
          description.style.transform = 'translateY(0)';
        }
      }, 500);
      
      setTimeout(() => {
        if (button) {
          button.style.opacity = '1';
          button.style.transform = 'translateY(0)';
        }
      }, 700);
    }
  }
  
  // Initialize the custom carousel
  const heroSection = document.getElementById('home');
  if (heroSection) {
    // First, update the HTML structure to match our custom carousel
    const swiperContainer = heroSection.querySelector('.swiper');
    if (swiperContainer) {
      swiperContainer.className = 'custom-carousel-container';
      
      const swiperWrapper = swiperContainer.querySelector('.swiper-wrapper');
      if (swiperWrapper) {
        swiperWrapper.className = 'slides-container';
        
        // Update slide classes
        const slides = swiperWrapper.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
          slide.className = 'carousel-slide';
        });
      }
      
      // Remove Swiper specific elements
      const swiperPagination = swiperContainer.querySelector('.swiper-pagination');
      const swiperButtonNext = swiperContainer.querySelector('.swiper-button-next');
      const swiperButtonPrev = swiperContainer.querySelector('.swiper-button-prev');
      
      if (swiperPagination) swiperPagination.remove();
      if (swiperButtonNext) swiperButtonNext.remove();
      if (swiperButtonPrev) swiperButtonPrev.remove();
      
      // Initialize our custom carousel
      const carousel = new CustomCarousel(swiperContainer, {
        autoplay: true,
        autoplaySpeed: 5000,
        animationSpeed: 600
      });
    }
  }
  
  // Fix for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute("href");
      
      // Check if the href is just "#" (empty anchor)
      if (targetId === "#") {
        return; // Do nothing for empty anchors
      }
      
      // Otherwise, try to find and scroll to the element
      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      } catch (error) {
        console.warn("Invalid selector:", targetId);
      }
    });
  });
});

// Add fadeInUp animation to CSS if not already defined
// if (!document.querySelector("style#swiper-animations")) {
//   const style = document.createElement("style");
//   style.id = "swiper-animations";
//   style.textContent = `
//         @keyframes fadeInUp {
//             from {
//                 opacity: 0;
//                 transform: translateY(20px);
//             }
//             to {
//                 opacity: 1;
//                 transform: translateY(0);
//             }
//         }
//     `;
//   document.head.appendChild(style);
// }

// Contact form handling
// document
//   .getElementById("contact-form")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();
//     alert("Transmission successful! Our starbase will reply at warp speed.");
//     this.reset();
//   });

// Improved smooth scrolling with header offset
// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     e.preventDefault();

//     const headerHeight = document.querySelector("header").offsetHeight;

//     window.scrollTo({
//       top: targetElement.offsetTop - headerHeight,
//       behavior: "smooth",
//     });
//   });
// });

// Popup handling
const loginPopup = document.getElementById("login-popup");
const signupPopup = document.getElementById("signup-popup");
const openLogin = document.getElementById("open-login");
const openSignup = document.getElementById("open-signup");
const closeLogin = document.getElementById("close-login");
const closeSignup = document.getElementById("close-signup");
const switchToSignup = document.getElementById("switch-to-signup");
const switchToLogin = document.getElementById("switch-to-login");

// Function to open popup with animation
function openPopup(popup) {
  document.body.style.overflow = "hidden"; // Prevent scrolling
  popup.style.display = "flex";

  // Trigger animation after a small delay to ensure display:flex is applied
  setTimeout(() => {
    popup.classList.add("active");
  }, 10);
}

// Function to close popup with animation
function closePopup(popup) {
  popup.classList.remove("active");

  // Wait for animation to complete before hiding
  setTimeout(() => {
    popup.style.display = "none";
    document.body.style.overflow = ""; // Restore scrolling
  }, 400); // Match the CSS transition duration
}

// Open login popup
if (openLogin) {
  openLogin.addEventListener("click", (e) => {
    e.preventDefault();
    openPopup(loginPopup);
  });
}

// Open signup popup
if (openSignup) {
  openSignup.addEventListener("click", (e) => {
    e.preventDefault();
    openPopup(signupPopup);
  });
}

// Close login popup
closeLogin.addEventListener("click", () => {
  closePopup(loginPopup);
});

// Close signup popup
closeSignup.addEventListener("click", () => {
  closePopup(signupPopup);
});

// Switch between popups
if (switchToSignup) {
  switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    closePopup(loginPopup);
    setTimeout(() => {
      openPopup(signupPopup);
    }, 400); // Match the CSS transition duration
  });
}

if (switchToLogin) {
  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    closePopup(signupPopup);
    setTimeout(() => {
      openPopup(loginPopup);
    }, 400); // Match the CSS transition duration
  });
}

// Close popup when clicking outside
loginPopup.addEventListener("click", (e) => {
  if (e.target === loginPopup) {
    closePopup(loginPopup);
  }
});

signupPopup.addEventListener("click", (e) => {
  if (e.target === signupPopup) {
    closePopup(signupPopup);
  }
});

// Form submission handling with validation feedback
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Add success animation
  const button = this.querySelector(".btn-submit");
  button.innerHTML = "Logging in...";
  button.disabled = true;

  // Simulate login process
  setTimeout(() => {
    alert("Login successful! Welcome back to the galaxy.");
    closePopup(loginPopup);
    this.reset();
    button.innerHTML = "Log In";
    button.disabled = false;
  }, 1000);
});

document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Password confirmation validation
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const button = this.querySelector(".btn-submit");

  if (password !== confirmPassword) {
    // Add shake animation for error
    const confirmPasswordInput = document.getElementById("confirm-password");
    confirmPasswordInput.classList.add("shake");

    // Remove shake class after animation completes
    setTimeout(() => {
      confirmPasswordInput.classList.remove("shake");
    }, 500);

    alert("Passwords do not match! Please try again.");
    return;
  }

  // Add success animation
  button.innerHTML = "Creating account...";
  button.disabled = true;

  // Simulate signup process
  setTimeout(() => {
    alert("Signup successful! Welcome to the TutorConnect cosmos.");
    closePopup(signupPopup);
    this.reset();
    button.innerHTML = "Sign Up";
    button.disabled = false;
  }, 1000);
});

// Add AOS integration for popup content if AOS is available
document.addEventListener("DOMContentLoaded", () => {
  let AOS; // Declare AOS variable
  if (typeof AOS !== "undefined") {
    // Initialize AOS for elements inside popups
    const popupElements = document.querySelectorAll(
      ".popup-content .form-group, .popup-content .btn-submit, .popup-content .popup-footer"
    );
    popupElements.forEach((el, index) => {
      el.setAttribute("data-aos", "fade-up");
      el.setAttribute("data-aos-delay", (index * 100).toString());
      el.setAttribute("data-aos-duration", "500");
    });
  }
});
