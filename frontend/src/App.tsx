import { useEffect, useRef, useState } from "react";
import { NutritionGoalsProvider } from "./components/NutritionGoals";
import AnalyzerWorkspace from "./components/AnalyzerWorkspace";
import LandingPage from "./components/LandingPage";
import { analyzeImage } from "./services/api";
import type { AnalysisResponse } from "./types/api";

type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AnalysisResponse }
  | { status: "error"; message: string };

type Route = "landing" | "analyzer";

function getRouteFromHash(): Route {
  if (
    typeof window !== "undefined" &&
    window.location.hash.startsWith("#/analyze")
  ) {
    return "analyzer";
  }
  return "landing";
}

interface AppProps {
  initialRoute?: Route;
}

function AppContent({ initialRoute }: AppProps = {}) {
  const [route, setRoute] = useState<Route>(initialRoute || getRouteFromHash());
  const inFlight = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigateToAnalyzer = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "#/analyze";
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        // JSDOM or unsupported browser
      }
    }
    setRoute("analyzer");
  };

  const navigateToHome = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "#/";
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        // JSDOM or unsupported browser
      }
    }
    setRoute("landing");
  };

  const busy = state.status === "loading";
  const error = state.status === "error" ? state.message : "";
  const result = state.status === "success" ? state.result : null;

  const showError = (message: string) =>
    setState(message ? { status: "error", message } : { status: "idle" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current) return;
    if (!file) {
      showError("Choose a food photo before starting analysis.");
      return;
    }
    inFlight.current = true;
    setState({ status: "loading" });
    try {
      setState({
        status: "success",
        result: await analyzeImage(file),
      });
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Could not reach the server. Please try again.",
      );
    } finally {
      inFlight.current = false;
    }
  };

  if (route === "analyzer") {
    return (
      <AnalyzerWorkspace
        file={file}
        busy={busy}
        error={error}
        result={result}
        onFileChange={(next) => {
          setFile(next);
          setState({ status: "idle" });
        }}
        onSubmit={handleSubmit}
        showError={showError}
        onNavigateToHome={navigateToHome}
      />
    );
  }

  return <LandingPage onNavigateToAnalyzer={navigateToAnalyzer} />;
}

export default function App(props: AppProps = {}) {
  return (
    <NutritionGoalsProvider>
      <AppContent {...props} />
    </NutritionGoalsProvider>
  );
}
