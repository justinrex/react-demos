import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "./routes";

it("renders the overview page", () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/"]
  });

  render(<RouterProvider router={router} />);

  expect(
    screen.getByRole("heading", { name: /build one-off experiments/i }),
  ).toBeInTheDocument();
});
