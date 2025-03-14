// Store user data in localStorage
export function setUserData(userData) {
  localStorage.setItem("user", JSON.stringify(userData));
}

// Get user data from localStorage
export function getUserData() {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

// Remove user data from localStorage
export function clearUserData() {
  localStorage.removeItem("user");
}

// Check if user is logged in (client-side check)
export function isLoggedIn() {
  return !!getUserData();
}

// Update UI based on authentication state
export function updateAuthUI() {
    const isAuthenticated = isLoggedIn()
    const userData = getUserData()
  
    // Get UI elements
    const lookingForTutorBtn = document.getElementById("looking-for-tutor")
    const joinAsTutorBtn = document.getElementById("join-as-tutor")
    const userProfileBtn = document.getElementById("user-profile")
    const logoutBtn = document.getElementById("logout-btn")
    const userNameDisplay = document.getElementById("user-name")
  
    if (isAuthenticated && userData) {
      // User is logged in
      if (lookingForTutorBtn) lookingForTutorBtn.style.display = "none"
      if (joinAsTutorBtn) joinAsTutorBtn.style.display = "none"
      if (logoutBtn) logoutBtn.style.display = "inline-flex"
      if (userProfileBtn) userProfileBtn.style.display = "inline-flex"
      if (userNameDisplay) {
        userNameDisplay.textContent = userData.name
        userNameDisplay.style.display = "inline-flex"
      }
    } else {
      // User is logged out
      if (lookingForTutorBtn) lookingForTutorBtn.style.display = "inline-flex"
      if (joinAsTutorBtn) joinAsTutorBtn.style.display = "inline-flex"
      if (logoutBtn) logoutBtn.style.display = "none"
      if (userProfileBtn) userProfileBtn.style.display = "none"
      if (userNameDisplay) userNameDisplay.style.display = "none"
    }
  }
