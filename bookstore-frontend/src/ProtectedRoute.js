import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (role === "USER") {
        return <Navigate to="/books-dashboard" replace />;
    }
    else if(!token){
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;