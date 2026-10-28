import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "./routes";

it("redirects the root route to the first demo page", async () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/"]
  });

  render(<RouterProvider router={router} />);

  expect(
    await screen.findByRole("heading", {
      name: /understanding when to memoize and when not to/i
    }),
  ).toBeInTheDocument();
});

it("renders the effects page route", async () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/effects"]
  });

  render(<RouterProvider router={router} />);

  expect(
    await screen.findByRole("heading", {
      name: /use effects to synchronize, not to hold ordinary app logic/i
    }),
  ).toBeInTheDocument();
});

it("renders the lazy loading page route", async () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/lazy-loading"]
  });

  render(<RouterProvider router={router} />);

  expect(
    await screen.findByRole("heading", {
      name: /lazy load code, media, and long lists only when they are needed/i
    }),
  ).toBeInTheDocument();
});

it("renders the css foundations page route", async () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/css-foundations"]
  });

  render(<RouterProvider router={router} />);

  expect(
    await screen.findByRole("heading", {
      name: /choose a sizing system on purpose, then layer tokens and themes on top/i
    }),
  ).toBeInTheDocument();
});

it("renders the accessibility semantics page route", async () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/accessibility-semantics"]
  });

  render(<RouterProvider router={router} />);

  expect(
    await screen.findByRole("heading", {
      name: /choose semantic html first, then add accessibility details where they are actually needed/i
    }),
  ).toBeInTheDocument();
});

it("renders the forms page route", async () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/forms"]
  });

  render(<RouterProvider router={router} />);

  expect(
    await screen.findByRole("heading", {
      name: /choose the form architecture that matches the user experience you actually need/i
    }),
  ).toBeInTheDocument();
});

it("keeps the scoped connection when only the theme changes", async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(routes, { initialEntries: ["/effects"] });
  render(<RouterProvider router={router} />);

  const broadPanel = (await screen.findByRole("heading", {
    name: "Churned dependency graph",
  })).closest("article")!;
  const scopedPanel = screen.getByRole("heading", {
    name: "Scoped to the real dependency",
  }).closest("article")!;

  expect(within(broadPanel).getByText("connections: 1")).toBeInTheDocument();
  expect(within(scopedPanel).getByText("connections: 1")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Toggle theme" }));

  expect(within(broadPanel).getByText("connections: 2")).toBeInTheDocument();
  expect(within(scopedPanel).getByText("connections: 1")).toBeInTheDocument();
  expect(within(broadPanel).getByText("disconnect room design-review")).toBeInTheDocument();
  expect(within(scopedPanel).queryByText("disconnect room design-review")).not.toBeInTheDocument();
});
