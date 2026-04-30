import { lazy, Suspense } from "react";
import type { ComponentType, ReactNode } from "react";
import { Shell } from "./shell";
import { Navigate } from "react-router-dom";
type DemoPage = {
  slug: string;
  title: string;
  description: string;
  element: ReactNode;
  preload: () => Promise<unknown>;
};

function createLazyPage<TModule extends Record<string, unknown>>(
  loadModule: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  let modulePromise: Promise<TModule> | undefined;

  const preload = () => {
    if (!modulePromise) {
      modulePromise = loadModule();
    }

    return modulePromise;
  };

  const Component = lazy(async () => {
    const module = await preload();
    return {
      default: module[exportName] as ComponentType,
    };
  });

  return {
    preload,
    element: (
      <Suspense fallback={<RouteFallback />}>
        <Component />
      </Suspense>
    ),
  };
}

function RouteFallback() {
  return (
    <section className="page">
      <header className="page-intro">
        <p className="eyebrow">Loading demo</p>
        <h2>Preparing the page...</h2>
        <p className="page-intro-copy">
          This route is being lazy loaded so the app shell can stay lighter up front.
        </p>
      </header>
    </section>
  );
}

const memoizationPage = createLazyPage(
  () => import("./pages/MemoizationPage"),
  "MemoizationPage",
);
const effectsPage = createLazyPage(
  () => import("./pages/EffectsPage"),
  "EffectsPage",
);
const lazyLoadingPage = createLazyPage(
  () => import("./pages/LazyLoadingPage"),
  "LazyLoadingPage",
);
const cssFoundationsPage = createLazyPage(
  () => import("./pages/CssFoundationsPage"),
  "CssFoundationsPage",
);
const accessibilitySemanticsPage = createLazyPage(
  () => import("./pages/AccessibilitySemanticsPage"),
  "AccessibilitySemanticsPage",
);
const formsPage = createLazyPage(() => import("./pages/FormsPage"), "FormsPage");

export const demoPages: DemoPage[] = [
  {
    slug: "memoization",
    title: "Memoization",
    description: "Explore when memoization improves render behavior and when it adds unnecessary complexity.",
    ...memoizationPage,
  },
  {
    slug: "effects",
    title: "Effects",
    description: "Learn when an effect is necessary, when it is noise, and how cleanup prevents stale work.",
    ...effectsPage,
  },
  {
    slug: "lazy-loading",
    title: "Lazy Loading",
    description: "See what code to defer, where Suspense belongs, and when preloading improves perceived speed.",
    ...lazyLoadingPage,
  },
  {
    slug: "css-foundations",
    title: "CSS Foundations",
    description: "Compare rem vs em, see CSS variables in practice, and learn how theme tokens should be consumed.",
    ...cssFoundationsPage,
  },
  {
    slug: "accessibility-semantics",
    title: "A11y + Semantics",
    description: "Learn when native HTML gives you accessibility for free and where ARIA should complement it.",
    ...accessibilitySemanticsPage,
  },
  {
    slug: "forms",
    title: "Forms",
    description: "Compare controlled and uncontrolled form patterns, validation timing, and submit-state design.",
    ...formsPage,
  },
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
