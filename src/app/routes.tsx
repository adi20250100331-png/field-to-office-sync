import { createBrowserRouter, Outlet } from "react-router";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { CustomerLoginPage } from "./pages/CustomerLoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RecoveryPage } from "./pages/RecoveryPage";
import { FieldOfficerDashboard } from "./pages/FieldOfficerDashboard";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { DataCollectionForm } from "./pages/DataCollectionForm";
import { AdminDashboard } from "./pages/AdminDashboard";
import { TechArchitecture } from "./pages/TechArchitecture";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext";

// Root layout component that wraps all routes with providers
function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Outlet />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/customer/login",
        Component: CustomerLoginPage,
      },
      {
        path: "/field-officer/login",
        Component: LoginPage,
      },
      {
        path: "/admin/login",
        Component: AdminLoginPage,
      },
      {
        path: "/recovery",
        Component: RecoveryPage,
      },
      {
        path: "/customer",
        element: (
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/field-officer",
        element: (
          <ProtectedRoute requiredRole="field_officer">
            <FieldOfficerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/field-officer/collect-data",
        element: (
          <ProtectedRoute requiredRole="field_officer">
            <DataCollectionForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/architecture",
        Component: TechArchitecture,
      },
    ],
  },
]);
