import { Shell } from "./shell";
import { Navigate } from "react-router-dom";
import { MemoizationPage } from "./pages/MemoizationPage";
import { StateDemoPage } from "./pages/StateDemoPage";

export const demoPages = [
  {
    slug: "memoization",
    title: "Memoization",
    description: "Explore when memoization improves render behavior and when it adds unnecessary complexity.",
    element: <MemoizationPage />
  },
  {
    slug: "state-demo",
    title: "State Demo",
    description: "Simple page for experimenting with transitions between UI states.",
    element: <StateDemoPage />
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
