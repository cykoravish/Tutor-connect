// Initialize AOS animation library
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
  })

  // Hamburger menu functionality
  const hamburger = document.querySelector(".hamburger-menu")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const navButtons = document.querySelectorAll(".nav-btn")

  // Add animation delay variables to menu items
  ;[...navLinks, ...navButtons].forEach((item, index) => {
    item.style.setProperty("--i", index + 1)
  })

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", function () {
    this.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Toggle body scroll but maintain position
    if (navMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
    } else {
      // document.body.style.overflow = ""
      document.body.style.position = "static"
    }
  })

  // Close menu when clicking on a nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = "auto"
      document.body.style.position = "static"
    })
  })

  // Add active class to current section in navbar
  function highlightNavLink() {
    const sections = document.querySelectorAll("section")
    const scrollPosition = window.scrollY

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  }

  // Highlight active nav link on scroll
  window.addEventListener("scroll", highlightNavLink)

  // Add scroll animation to header
  const header = document.querySelector("header")
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 100) {
      header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)"
      header.style.background = "linear-gradient(135deg, rgba(26, 38, 52, 0.95), rgba(15, 25, 34, 0.95))"
      header.style.backdropFilter = "blur(10px)"
    } else {
      header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)"
      header.style.background = "linear-gradient(135deg, #1a2634, #0f1922)"
      header.style.backdropFilter = "none"
    }

    lastScrollTop = scrollTop
  })

  // Hero Carousel Implementation
  const carousel = document.querySelector(".hero-carousel")
  if (carousel) {
    const slides = document.querySelectorAll(".carousel-slide")
    const prevBtn = document.querySelector(".carousel-control.prev")
    const nextBtn = document.querySelector(".carousel-control.next")
    const indicators = document.querySelectorAll(".carousel-indicators .indicator")

    let currentIndex = 0
    let interval
    const autoplayDelay = 5000

    // Function to show a specific slide
    function showSlide(index) {
      // Hide all slides
      slides.forEach((slide) => {
        slide.classList.remove("active")
      })

      // Update indicators
      indicators.forEach((indicator) => {
        indicator.classList.remove("active")
      })

      // Show the current slide and indicator
      slides[index].classList.add("active")
      indicators[index].classList.add("active")

      // Update current index
      currentIndex = index
    }

    // Function to show the next slide
    function nextSlide() {
      let newIndex = currentIndex + 1
      if (newIndex >= slides.length) {
        newIndex = 0
      }
      showSlide(newIndex)
    }

    // Function to show the previous slide
    function prevSlide() {
      let newIndex = currentIndex - 1
      if (newIndex < 0) {
        newIndex = slides.length - 1
      }
      showSlide(newIndex)
    }

    // Set up event listeners for controls
    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        prevSlide()
        resetAutoplay()
      })

    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        nextSlide()
        resetAutoplay()
      })

    // Set up event listeners for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        showSlide(index)
        resetAutoplay()
      })
    })

    // Start autoplay
    function startAutoplay() {
      interval = setInterval(nextSlide, autoplayDelay)
    }

    // Reset autoplay
    function resetAutoplay() {
      clearInterval(interval)
      startAutoplay()
    }

    // Pause autoplay on hover
    carousel.addEventListener("mouseenter", () => {
      clearInterval(interval)
    })

    carousel.addEventListener("mouseleave", () => {
      startAutoplay()
    })

    // Initialize carousel
    showSlide(0)
    startAutoplay()
  }

  // Popup handling
  const loginPopup = document.getElementById("login-popup")
  const signupPopup = document.getElementById("signup-popup")
  const openLogin = document.getElementById("open-login")
  const openSignup = document.getElementById("open-signup")
  const closeLogin = document.getElementById("close-login")
  const closeSignup = document.getElementById("close-signup")
  const switchToSignup = document.getElementById("switch-to-signup")
  const switchToLogin = document.getElementById("switch-to-login")

  // Function to open popup with animation
  function openPopup(popup) {
    document.body.style.overflow = "hidden" // Prevent scrolling
    popup.style.display = "flex"

    // Trigger animation after a small delay to ensure display:flex is applied
    setTimeout(() => {
      popup.classList.add("active")
    }, 10)
  }

  // Function to close popup with animation
  function closePopup(popup) {
    popup.classList.remove("active")

    // Wait for animation to complete before hiding
    setTimeout(() => {
      popup.style.display = "none"
      document.body.style.overflow = "" // Restore scrolling
    }, 400) // Match the CSS transition duration
  }

  // Open login popup
  if (openLogin) {
    openLogin.addEventListener("click", (e) => {
      e.preventDefault()
      openPopup(loginPopup)
    })
  }

  // Open signup popup
  if (openSignup) {
    openSignup.addEventListener("click", (e) => {
      e.preventDefault()
      openPopup(signupPopup)
    })
  }

  // Close login popup
  if (closeLogin) {
    closeLogin.addEventListener("click", () => {
      closePopup(loginPopup)
    })
  }

  // Close signup popup
  if (closeSignup) {
    closeSignup.addEventListener("click", () => {
      closePopup(signupPopup)
    })
  }

  // Switch between popups
  if (switchToSignup) {
    switchToSignup.addEventListener("click", (e) => {
      e.preventDefault()
      closePopup(loginPopup)
      setTimeout(() => {
        openPopup(signupPopup)
      }, 400) // Match the CSS transition duration
    })
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", (e) => {
      e.preventDefault()
      closePopup(signupPopup)
      setTimeout(() => {
        openPopup(loginPopup)
      }, 400) // Match the CSS transition duration
    })
  }

  // Close popup when clicking outside
  if (loginPopup) {
    loginPopup.addEventListener("click", (e) => {
      if (e.target === loginPopup) {
        closePopup(loginPopup)
      }
    })
  }

  if (signupPopup) {
    signupPopup.addEventListener("click", (e) => {
      if (e.target === signupPopup) {
        closePopup(signupPopup)
      }
    })
  }

  // Form submission handling with validation feedback
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Add success animation
      const button = this.querySelector(".btn-submit")
      button.innerHTML = "Logging in..."
      button.disabled = true

      // Simulate login process
      setTimeout(() => {
        alert("Login successful! Welcome back to the galaxy.")
        closePopup(loginPopup)
        this.reset()
        button.innerHTML = "Log In"
        button.disabled = false
      }, 1000)
    })
  }

  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Password confirmation validation
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const button = this.querySelector(".btn-submit")

      if (password !== confirmPassword) {
        // Add shake animation for error
        const confirmPasswordInput = document.getElementById("confirm-password")
        confirmPasswordInput.classList.add("shake")

        // Remove shake class after animation completes
        setTimeout(() => {
          confirmPasswordInput.classList.remove("shake")
        }, 500)

        alert("Passwords do not match! Please try again.")
        return
      }

      // Add success animation
      button.innerHTML = "Creating account..."
      button.disabled = true

      // Simulate signup process
      setTimeout(() => {
        alert("Signup successful! Welcome to the TutorConnect cosmos.")
        closePopup(signupPopup)
        this.reset()
        button.innerHTML = "Sign Up"
        button.disabled = false
      }, 1000)
    })
  }

  // Contact form handling
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()
      alert("Transmission successful! Our starbase will reply at warp speed.")
      this.reset()
    })
  }

  // Improved smooth scrolling with header offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // Skip for empty anchors
      if (this.getAttribute("href") === "#") return

      e.preventDefault()

      try {
        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          const headerHeight = document.querySelector("header").offsetHeight

          window.scrollTo({
            top: targetElement.offsetTop - headerHeight,
            behavior: "smooth",
          })
        }
      } catch (error) {
        console.warn("Invalid selector:", this.getAttribute("href"))
      }
    })
  })
})

