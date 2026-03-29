import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "./App.css"
import App from "./App.jsx"
import { Toaster } from "react-hot-toast"   // ✅ ADD THIS

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster 
      position="top-right" 
      containerStyle={{ top: '70px', right: '20px' }} 
    />
    <App />
  </StrictMode>
)
