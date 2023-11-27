import React from "react";
import ReactDOM from "react-dom/client";
import Root from "@routes/Root.tsx";

import "./styles.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import ErrorPage from "@routes/ErrorPage";
import Settings from "@routes/Settings";
import Home from "@routes/Home";

const router = createHashRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "home/",
                element: <Home />,
            },

            {
                path: "settings/",
                element: <Settings />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
