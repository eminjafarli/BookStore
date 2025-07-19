import {Routes, Route, Navigate} from "react-router-dom";
import HomePage from "./HomePage";
import UsersDashboard from "./UsersDashboard";
import BooksDashboard from "./BooksDashboard";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users-dashboard"
                element={
                    <ProtectedRoute>
                        <UsersDashboard/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/books-dashboard"
                element={

                    <BooksDashboard/>

                }
            />
        </Routes>
    );
}

export default App;
