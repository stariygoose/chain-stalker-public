import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router/router";
import { useInitTheme } from "./model/useInitTheme";

export default function App() {
  useInitTheme();

  return <RouterProvider router={router} />;
}
