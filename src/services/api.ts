// src/services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

export const apiService = {
  // A. Dashboard & Ringkasan
  getDashboardSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard summary");
    return response.json();
  },

  // B. Manajemen Barang (Inventory)
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  saveProduct: async (payload: { sku_code: string; name: string; category: string; stock: number; status: string }) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to save product");
    return data;
  },

  registerResi: async (params: { item_code: string; resi: string; courier: string; destination?: string }) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });

    // Cek content-type sebelum parse JSON
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Server belum diperbarui atau sedang tidak aktif. Coba deploy ulang backend.");
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Gagal mendaftarkan resi");
    return data;
  },

  trackDirect: async (resi: string, item_code?: string) => {
    const params = new URLSearchParams({ resi });
    if (item_code) params.append("item_code", item_code);
    const response = await fetch(`${API_BASE_URL}/track-direct?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to track direct");
    return response.json();
  },

  getShipmentList: async () => {
    const response = await fetch(`${API_BASE_URL}/list`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch shipment list");
    return response.json();
  },

  getShipmentStatus: async (item_code: string) => {
    const response = await fetch(`${API_BASE_URL}/status/${item_code}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch shipment status");
    return response.json();
  },

  deleteShipment: async (item_code: string) => {
    const response = await fetch(`${API_BASE_URL}/delete/${item_code}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete shipment");
    return response.json();
  },

  // D. Retur Barang
  getReturns: async () => {
    const response = await fetch(`${API_BASE_URL}/returns`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch returns");
    return response.json();
  },

  saveReturn: async (payload: { sku_code: string; product_name: string; reason: string; status: string }) => {
    const response = await fetch(`${API_BASE_URL}/returns`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to save return");
    return data;
  },

  // E. Stock Opname
  startStockOpname: async () => {
    const response = await fetch(`${API_BASE_URL}/stock-opname/start`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to start stock opname");
    return response.json();
  },

  recordOpnameItem: async (payload: { opname_id: number; sku_code: string; product_name: string; system_stock: number; physical_stock: number }) => {
    const response = await fetch(`${API_BASE_URL}/stock-opname/item`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to record opname item");
    return data;
  },

  completeStockOpname: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/stock-opname/complete/${id}`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to complete stock opname");
    return response.json();
  }
};
