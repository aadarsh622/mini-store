import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import { ProtectedRoute, AdminRoute } from '../components/ProtectedRoute.jsx';

const Home = lazy(() => import('../pages/Home.jsx'));
const ProductDetails = lazy(() => import('../pages/ProductDetails.jsx'));
const About = lazy(() => import('../pages/About.jsx'));
const Service = lazy(() => import('../pages/Service.jsx'));
const Contact = lazy(() => import('../pages/Contact.jsx'));
const Categories = lazy(() => import('../pages/Categories.jsx'));
const Checkout = lazy(() => import('../pages/Checkout.jsx'));
const CardPayment = lazy(() => import('../pages/CardPayment.jsx'));
const UpiPayment = lazy(() => import('../pages/UpiPayment.jsx'));
const NetBanking = lazy(() => import('../pages/NetBanking.jsx'));
const Orders = lazy(() => import('../pages/Orders.jsx'));
const Login = lazy(() => import('../pages/Auth/Login.jsx'));
const Register = lazy(() => import('../pages/Auth/Register.jsx'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword.jsx'));
const Profile = lazy(() => import('../pages/Auth/Profile.jsx'));
const Settings = lazy(() => import('../pages/Auth/Settings.jsx'));
const Wishlist = lazy(() => import('../pages/Auth/Wishlist.jsx'));
const AdminProducts = lazy(() => import('../pages/Admin/AdminProducts.jsx'));
const AdminOrders = lazy(() => import('../pages/Admin/AdminOrders.jsx'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard.jsx'));
const AdminUsers = lazy(() => import('../pages/Admin/AdminUsers.jsx'));
const AdminSettings = lazy(() => import('../pages/Admin/AdminSettings.jsx'));
const AdminMonitoring = lazy(() => import('../pages/Admin/AdminMonitoring.jsx'));

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="main">
          <div className="page">
            <div className="status" role="status">
              Loading page…
            </div>
          </div>
        </div>
      }
    >
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/deals" element={<PlaceholderPage title="Today's Deals" />} />
        <Route path="/new-arrivals" element={<PlaceholderPage title="New Arrivals" />} />
        <Route path="/best-sellers" element={<PlaceholderPage title="Best Sellers" />} />
        <Route path="/trending" element={<PlaceholderPage title="Trending" />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/card-payment"
          element={
            <ProtectedRoute>
              <CardPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upi-payment"
          element={
            <ProtectedRoute>
              <UpiPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/net-banking"
          element={
            <ProtectedRoute>
              <NetBanking />
            </ProtectedRoute>
          }
        />
        <Route path="/offers" element={<PlaceholderPage title="Offers" />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="monitoring" element={<AdminMonitoring />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="main">
      <div className="page">
        <h1 className="pageTitle">{title}</h1>
        <div className="status">This page is coming soon.</div>
      </div>
    </div>
  );
}

export default AppRoutes;
