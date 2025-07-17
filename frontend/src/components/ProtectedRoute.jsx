import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/store";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAppStore();

    return (
        <>
            {isAuthenticated && <>{children}</>}
            {!isAuthenticated && Navigate("/login")}
        </>
    );
}
