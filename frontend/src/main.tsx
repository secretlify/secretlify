import "./index.css";

import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { resetContext } from "kea";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import axios from "axios";
import { routerPlugin } from "kea-router";
import { loadersPlugin } from "kea-loaders";
import { subscriptionsPlugin } from "kea-subscriptions";
import { localStoragePlugin } from "kea-localstorage";

// Create a new router instance
const router = createRouter({ routeTree });

resetContext({
  plugins: [
    routerPlugin,
    loadersPlugin,
    subscriptionsPlugin,
    localStoragePlugin({
      storageEngine: window.localStorage,
      prefix: "secretly-app",
      separator: "_",
    }),
  ],
});

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
