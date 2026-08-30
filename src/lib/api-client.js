import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://saifu-backend.instanclay.workers.dev";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function getSessionToken() {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith("better-auth.session_token=")) {
      return cookie.split("=").slice(1).join("=");
    }
    if (cookie.startsWith("__Secure-better-auth.session_token=")) {
      return cookie.split("=").slice(1).join("=");
    }
  }
  return null;
}

apiClient.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================
// Auth Endpoints
// =====================

export async function signIn(email, password) {
  const response = await apiClient.post("/api/auth/sign-in", {
    email,
    password,
  });
  return response.data;
}

export async function signUp(email, password, name) {
  const response = await apiClient.post("/api/auth/sign-up", {
    email,
    password,
    name,
  });
  return response.data;
}

export async function signOut() {
  const response = await apiClient.post("/api/auth/sign-out");
  return response.data;
}

export async function getSession() {
  try {
    const response = await apiClient.get("/api/auth/session");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

// =====================
// Wallets Endpoints
// =====================

export async function getWallets() {
  const response = await apiClient.get("/api/wallets");
  return response.data?.data || response.data || [];
}

export async function createWallet(data) {
  const response = await apiClient.post("/api/wallets", data);
  return response.data;
}

export async function updateWallet(walletId, data) {
  const response = await apiClient.put(`/api/wallets/${walletId}`, data);
  return response.data;
}

export async function deleteWallet(walletId) {
  const response = await apiClient.delete(`/api/wallets/${walletId}`);
  return response.data;
}

// =====================
// Transactions Endpoints
// =====================

export async function getTransactions(walletId) {
  const response = await apiClient.get("/api/transactions", {
    params: walletId ? { walletId } : {},
  });
  return response.data?.data || response.data || [];
}

export async function createTransaction(data) {
  const response = await apiClient.post("/api/transactions", data);
  return response.data;
}

export async function updateTransaction(transactionId, data) {
  const response = await apiClient.put(`/api/transactions/${transactionId}`, data);
  return response.data;
}

export async function deleteTransaction(transactionId) {
  const response = await apiClient.delete(`/api/transactions/${transactionId}`);
  return response.data;
}

export async function transferBetweenWallets(data) {
  const response = await apiClient.post("/api/transactions/transfer", data);
  return response.data;
}

export default apiClient;
