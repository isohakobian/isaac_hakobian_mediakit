import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";

// Keep charts, backup tools and admin editors out of the public landing bundle.
const Analytics = lazy(() =>
  import("./pages/Analytics").then(module => ({ default: module.Analytics }))
);
const Collaborations = lazy(() => import("./pages/Collaborations"));
const BrandRequests = lazy(() => import("./pages/BrandRequests"));
const Backup = lazy(() => import("./pages/Backup"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/collaborations"} component={Collaborations} />
      <Route path={"/brand-requests"} component={BrandRequests} />
      <Route path={"/backup"} component={Backup} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Suspense
            fallback={
              <div
                role="status"
                aria-label="Loading"
                className="min-h-screen bg-white"
              />
            }
          >
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
