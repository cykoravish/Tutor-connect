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
  const isAuthenticated = isLoggedIn();
  const userData = getUserData();

  // Get UI elements
  const loginBtn = document.getElementById("open-login");
  const signupBtn = document.getElementById("open-signup");
  const logoutBtn = document.getElementById("logout-btn");
  const userProfileBtn = document.getElementById("user-profile");
  const userNameDisplay = document.getElementById("user-name");

  if (isAuthenticated && userData) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
    if (userProfileBtn) userProfileBtn.style.display = "block";
    if (userNameDisplay) {
      userNameDisplay.textContent = userData.name;
      userNameDisplay.style.display = "block";
    }
  } else {
    // User is logged out
    if (loginBtn) loginBtn.style.display = "block";
    if (signupBtn) signupBtn.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userProfileBtn) userProfileBtn.style.display = "none";
    if (userNameDisplay) userNameDisplay.style.display = "none";
  }
}
