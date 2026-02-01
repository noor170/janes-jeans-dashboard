import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GenderFilterProvider } from "@/contexts/GenderFilterContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Shipments from "./pages/Shipments";
import ShippingVendors from "./pages/ShippingVendors";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
// Shop pages
import ShoppingDashboard from "./pages/shop/ShoppingDashboard";
import ProductDetails from "./pages/shop/ProductDetails";
import CartPage from "./pages/shop/CartPage";
import CheckoutPage from "./pages/shop/CheckoutPage";
import PaymentPage from "./pages/shop/PaymentPage";
import OrderSuccessPage from "./pages/shop/OrderSuccessPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <BrowserRouter>
          <LanguageProvider>
            <GenderFilterProvider>
              <NotificationProvider>
                <AuthProvider>
                  <CartProvider>
                    <Toaster />
                    <Sonner />
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      
                      {/* Shop Routes (Guest Checkout - No Auth Required) */}
                      <Route path="/shop" element={<ShoppingDashboard />} />
                      <Route path="/shop/product/:productId" element={<ProductDetails />} />
                      <Route path="/shop/cart" element={<CartPage />} />
                      <Route path="/shop/checkout" element={<CheckoutPage />} />
                      <Route path="/shop/payment" element={<PaymentPage />} />
                      <Route path="/shop/order-success" element={<OrderSuccessPage />} />
                      
                      {/* Protected Dashboard Routes - Requires Authentication */}
                      <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/inventory" element={<Inventory />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/shipments" element={<Shipments />} />
                          <Route path="/shipping-vendors" element={<ShippingVendors />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/settings" element={<Settings />} />
                        </Route>
                      </Route>
                      
                      {/* Admin Routes - Requires Admin Role */}
                      <Route element={<ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']} />}>
                        <Route element={<DashboardLayout />}>
                          <Route path="/admin" element={<AdminDashboard />} />
                          <Route path="/admin/users" element={<UserManagement />} />
                          <Route path="/admin/audit-logs" element={<AuditLogs />} />
                        </Route>
                      </Route>
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </CartProvider>
                </AuthProvider>
              </NotificationProvider>
            </GenderFilterProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
