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
