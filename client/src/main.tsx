import React from "react";
import ReactDOM from "react-dom/client";
import Root from "@routes/Root.tsx";

import "./index.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import ErrorPage from "@routes/ErrorPage";
import Settings from "@routes/Settings";
import Home from "@routes/Home";
import Scan from "@routes/Scan";
import NewConnection from "@routes/NewConnection";

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
                path: "scan/",
                element: <Scan />,
            },
            {
                path: "settings/",
                element: <Settings />,
            },
            {
                path: "connections/new",
                element: <NewConnection />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
