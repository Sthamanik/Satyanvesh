import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/react-query";
import AppRoutes from "@/routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Main App Routes */}
        <AppRoutes />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1E2A44",
              color: "#fff",
              borderRadius: "8px",
            },
            success: {
              iconTheme: {
                primary: "#2E7D32",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#C62828",
                secondary: "#fff",
              },
            },
          }}
        />

        {/* React Query Devtools (only in development) */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
