import { Shell } from "./shell";
import { HomePage } from "./pages/HomePage";
import { MemoDemoPage } from "./pages/MemoDemoPage";
import { StateDemoPage } from "./pages/StateDemoPage";

export const demoPages = [
  {
    slug: "memo-demo",
    title: "Memo Demo",
    description: "Shows how local state and derived lists behave during re-renders.",
    element: <MemoDemoPage />
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
        element: <HomePage />
      },
      ...demoPages.map((page) => ({
        path: page.slug,
        element: page.element
      }))
    ]
  }
];
