import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MetaUpdater } from "./components/MetaUpdater";
import Login from "./pages/Login";
import ClientPortal from "./pages/ClientPortal";
import ClientQuotes from "./pages/ClientQuotes";
import Quote from "./pages/Quote";
import Settings from "./pages/Settings";
import Authors from "./pages/Authors";
import Categories from "./pages/Categories";
import Quotes from "./pages/Quotes";
import Subscribers from "./pages/Subscribers";
import Feedback from "./pages/Feedback";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Subscribe from "./pages/Subscribe";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <MetaUpdater />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ClientPortal />} />
              <Route path="/quotes" element={<ClientQuotes />} />
              <Route path="/quote/:id" element={<Quote />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/subscribe" element={<Subscribe />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <Dashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <Dashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/quotes"
                element={
                  <AdminProtectedRoute>
                    <Quotes />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/authors"
                element={
                  <AdminProtectedRoute>
                    <Authors />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminProtectedRoute>
                    <Categories />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/subscribers"
                element={
                  <AdminProtectedRoute>
                    <Subscribers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminProtectedRoute>
                    <Settings />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/feedback"
                element={
                  <AdminProtectedRoute>
                    <Feedback />
                  </AdminProtectedRoute>
                }
              />
              
              {/* Protected User Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div>Profile Page</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <div>Favorites Page</div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;