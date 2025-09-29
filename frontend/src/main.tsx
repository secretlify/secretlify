import "@fontsource-variable/open-sans";
import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { resetContext } from "kea";
import ReactDOM from "react-dom/client";
// Import the generated route tree
import axios from "axios";
import { loadersPlugin } from "kea-loaders";
import { localStoragePlugin } from "kea-localstorage";
import { routerPlugin } from "kea-router";
import { subscriptionsPlugin } from "kea-subscriptions";
import { PostHogProvider } from "posthog-js/react";
import { routeTree } from "./routeTree.gen";

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

const posthogOptions = {
  api_host: "https://ph.cryptly.dev",
};

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
  root.render(
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_KEY}
      options={posthogOptions}
    >
      <RouterProvider router={router} />
    </PostHogProvider>
  );
}
