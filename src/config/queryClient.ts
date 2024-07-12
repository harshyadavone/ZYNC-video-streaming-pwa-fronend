import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
