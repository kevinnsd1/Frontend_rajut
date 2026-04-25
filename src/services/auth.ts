// src/services/auth.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://kevinnsd1-website-rajut.hf.space";

export const authService = {
  login: async (payload: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || "Login failed");
      }
      
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to connect to server");
    }
  },

  register: async (payload: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || "Registration failed");
      }
      
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to connect to server");
    }
  }
};
