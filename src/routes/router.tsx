import { createBrowserRouter } from "react-router-dom";
import App from "../pages/Home/App";
import Layout from "../layout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children={<App />} />,
  },
]);

export default router;
