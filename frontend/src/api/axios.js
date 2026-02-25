import axios from "axios"

// ─── Base URLs ────────────────────────────────────────────────────────────────
const LOCAL_URL = "http://localhost:8000/api"       // local development
const NETWORK_URL = "http://192.168.1.15:8000/api"    // LAN / network access

// Switch between LOCAL_URL and NETWORK_URL as needed
const BASE_URL = NETWORK_URL

// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookies ke liye IMPORTANT
})

export default api