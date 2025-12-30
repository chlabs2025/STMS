import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"

// admin
import A_Dashboard from "./pages/admin/A_Dashboard"
import A_AddImli from "./pages/admin/A_Addimli"

// operator
import O_Dashboard from "./pages/operator/O_Dashboard"
import O_AddImli from "./pages/operator/O_Addimli"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* public */}
        <Route path="/" element={<Login />} />

        {/* admin routes */}
        <Route path="/admin/dashboard" element={<A_Dashboard />} />
        <Route path="/admin/add-imli" element={<A_AddImli />} />

        {/* operator routes */}
        <Route path="/operator/dashboard" element={<O_Dashboard />} />
        <Route path="/operator/add-imli" element={<O_AddImli />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
