import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./lib/store";
import { Layout } from "./components/Layout";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Events from "./pages/Events";
import Join from "./pages/Join";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={Admin} />
        <Route path="/events" component={Events} />
        <Route path="/join" component={Join} />
        <Route component={() => <div className="text-center p-10 mt-20 text-red-500 font-bold">404 - Area Not Found</div>} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;