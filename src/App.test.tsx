import { render, screen } from "@testing-library/react";
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
