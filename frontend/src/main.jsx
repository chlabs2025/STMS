import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./app.css"
import App from "./App.jsx"
import { Toaster } from "react-hot-toast"   // ✅ ADD THIS

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-right" />          {/* ✅ ADD THIS */}
    <App />
  </StrictMode>
)
