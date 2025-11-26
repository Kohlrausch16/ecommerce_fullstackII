import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { AuthProvider } from "./contexts/AuthContext";
import HomeController from "./controllers/HomeController";
import LoginPage from "./views/pages/LoginPage";
import RegisterPage from "./views/pages/RegisterPage";
import ProfilePage from "./views/pages/ProfilePage";
import ProductDetailPage from "./views/pages/ProductDetailPage";
import SuppliersPage from "./views/pages/SuppliersPage";
import SupplierFormPage from "./views/pages/SupplierFormPage";
import AdminDashboard from "./views/pages/AdminDashboard/AdminDashboard";
import CartPage from "./views/pages/CartPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomeController />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="/product/:id" element={<ProductDetailPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/suppliers"
                element={
                  <ProtectedRoute>
                    <SuppliersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/suppliers/new"
                element={
                  <ProtectedRoute>
                    <SupplierFormPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/suppliers/edit/:id"
                element={
                  <ProtectedRoute>
                    <SupplierFormPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
