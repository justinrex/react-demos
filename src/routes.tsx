import { Shell } from "./shell";
import { Navigate } from "react-router-dom";
import { MemoizationPage } from "./pages/MemoizationPage";
import { EffectsPage } from "./pages/EffectsPage";
import { LazyLoadingPage } from "./pages/LazyLoadingPage";
import { CssFoundationsPage } from "./pages/CssFoundationsPage";
import { AccessibilitySemanticsPage } from "./pages/AccessibilitySemanticsPage";
import { FormsPage } from "./pages/FormsPage";

export const demoPages = [
  {
    slug: "memoization",
    title: "Memoization",
    description: "Explore when memoization improves render behavior and when it adds unnecessary complexity.",
    element: <MemoizationPage />
  },
  {
    slug: "effects",
    title: "Effects",
    description: "Learn when an effect is necessary, when it is noise, and how cleanup prevents stale work.",
    element: <EffectsPage />
  },
  {
    slug: "lazy-loading",
    title: "Lazy Loading",
    description: "See what code to defer, where Suspense belongs, and when preloading improves perceived speed.",
    element: <LazyLoadingPage />
  },
  {
    slug: "css-foundations",
    title: "CSS Foundations",
    description: "Compare rem vs em, see CSS variables in practice, and learn how theme tokens should be consumed.",
    element: <CssFoundationsPage />
  },
  {
    slug: "accessibility-semantics",
    title: "A11y + Semantics",
    description: "Learn when native HTML gives you accessibility for free and where ARIA should complement it.",
    element: <AccessibilitySemanticsPage />
  },
  {
    slug: "forms",
    title: "Forms",
    description: "Compare controlled and uncontrolled form patterns, validation timing, and submit-state design.",
    element: <FormsPage />
  }
];

export const routes = [
  {
    path: "/",
    element: <Shell />,
    children: [
      {
        index: true,
        element: <Navigate to="/memoization" replace />
      },
      ...demoPages.map((page) => ({
        path: page.slug,
        element: page.element
      }))
    ]
  }
];
