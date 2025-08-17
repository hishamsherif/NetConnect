import { useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/layout/layout';
import Dashboard from './pages/dashboard';
import Contacts from './pages/contacts';
import NetworkMap from './pages/network-map';
import Analytics from './pages/analytics';
import ContactProfile from './pages/contact-profile';
import NotFound from './pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  useEffect(() => {
    // Set up any global app initialization here
    console.log('NetConnect App initialized');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/contacts/:id" component={ContactProfile} />
          <Route path="/network-map" component={NetworkMap} />
          <Route path="/analytics" component={Analytics} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}
