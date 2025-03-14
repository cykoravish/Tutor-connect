const API_BASE_URL = "http://localhost:3000"; // Adjust based on your backend URL

// Generic fetch wrapper with error handling
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: options.credentials || "same-origin",  // <-- FIXED
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();
    console.log("data: ", data);
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
    credentials: "include",  // <-- INCLUDE COOKIES
    body: JSON.stringify({ name, email, password }),
  });
}
