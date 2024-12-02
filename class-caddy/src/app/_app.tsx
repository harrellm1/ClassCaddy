import { api } from "~/trpc/react.tsx";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider>
        <Component {...pageProps} />
      </api.Provider>
    </QueryClientProvider>
  );
}
