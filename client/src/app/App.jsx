import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "../shared/layout/SiteLayout";
import ProtectedRoute from "../shared/routing/ProtectedRoute";
import HomePage from "../features/public/pages/HomePage";
import { AboutPage } from "../features/public/pages/AboutPage";
import { ServicesPage } from "../features/public/pages/ServicesPage";
import { ServiceDetailPage } from "../features/public/pages/ServiceDetailPage";
import { ContactPage } from "../features/public/pages/ContactPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { BookingPage } from "../features/booking/pages/BookingPage";
import { ClientDashboardPage } from "../features/client/pages/ClientDashboardPage";
import { AdminDashboardPage } from "../features/admin/pages/AdminDashboardPage";
import NotFoundPage from "../shared/pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<ClientDashboardPage />} />
            <Route path="admin" element={<ProtectedRoute role="admin" />}>
              <Route index element={<AdminDashboardPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
