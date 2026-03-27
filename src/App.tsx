import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { POSPage } from '@/pages/POSPage';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <POSPage />
    </QueryClientProvider>
  );
}

export default App;
