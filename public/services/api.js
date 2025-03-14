const API_BASE_URL = "http://localhost:3000";

// Generic fetch wrapper with error handling
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: options.credentials || "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Specific signup API call
export async function signupUser({ name, email, password }) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// Login API call
export async function loginUser({ email, password }) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

// Logout API call
export async function logoutUser() {
  return apiRequest("/api/auth/logout", {
    method: "GET",
  })
}

// Get current user profile
export async function getCurrentUser() {
  return apiRequest("/api/auth/profile", {
    method: "GET",
  })
}

// Check if user is authenticated
export async function checkAuth() {
  try {
    const userData = await getCurrentUser()
    return { isAuthenticated: true, user: userData.user }
  } catch (error) {
    return { isAuthenticated: false, user: null }
  }
}

