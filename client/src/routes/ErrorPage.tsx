import { IconHome } from "@tabler/icons-react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    let errorMsg: string;

    if (isRouteErrorResponse(error)) {
        errorMsg = error.data?.message || error.statusText;
    } else if (error instanceof Error) {
        errorMsg = error.message;
    } else if (typeof error === "string") {
        errorMsg = error;
    } else {
        console.error(error);
        errorMsg = "Unknown error";
    }

    return (
        <div
            id="error-page"
            className="flex flex-col gap-8 justify-center items-center h-screen bg-base-100 text-base-content"
        >
            <h1 className="text-4xl font-bold">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p className="text-slate-400">
                <i>{errorMsg}</i>
            </p>

            <Link to="/" className="btn btn-accent">
                <IconHome />
                Return
            </Link>
        </div>
    );
}
