const API_BASE = "http://localhost:5000/api";

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("seva_token");
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.errors?.[0]?.msg || "Request failed");
    return data;
  },

  // Auth
  register(formData) {
    return this.request("/auth/register", { method: "POST", body: JSON.stringify(formData) });
  },
  login(registrationId, dob) {
    return this.request("/auth/login", { method: "POST", body: JSON.stringify({ registrationId, dob }) });
  },

  // Workers
  searchWorkers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/workers?${query}`);
  },
  getWorker(id) {
    return this.request(`/workers/${id}`);
  },
  updateProfile(updates) {
    return this.request("/workers/me", { method: "PATCH", body: JSON.stringify(updates) });
  },

  // Bookings
  createBooking(data) {
    return this.request("/bookings", { method: "POST", body: JSON.stringify(data) });
  },
};
