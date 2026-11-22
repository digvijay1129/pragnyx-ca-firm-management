import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import { AboutPage, ServicesPage, ServiceDetailPage, ContactPage, LoginPage, RegisterPage, BookingPage, ClientDashboardPage, AdminDashboardPage, NotFoundPage } from "./pages/Pages";

export default function App() {
  return <BrowserRouter><Routes><Route element={<Layout />}>
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
      <Route path="admin" element={<ProtectedRoute role="admin" />}><Route index element={<AdminDashboardPage />} /></Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes></BrowserRouter>;
}
