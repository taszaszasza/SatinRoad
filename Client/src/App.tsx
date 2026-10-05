import { useState } from "react";
import { Role, type UserDto } from "../Api.ts";
import { LoginView } from "./views/LoginView.tsx";
import { UserDashboard } from "./views/UserDashboard.tsx";
import { AdminDashboard } from "./views/AdminDashboard.tsx";
import "./index.css";

export function App() {
    const [currentUser, setCurrentUser] = useState<UserDto | null>(null);

    const handleLogout = () => {
        setCurrentUser(null);
    };

    // Helper function to decide which screen to display
    const renderScreen = () => {
        // 1. Not logged in -> Show Login View
        if (!currentUser) {
            return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
        }

        // 2. Logged in as Admin -> Show Admin View
        if (currentUser.role === Role.Admin) {
            return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
        }

        // 3. Logged in as regular User (Shopper) -> Show Shopper View
        return <UserDashboard currentUser={currentUser} onLogout={handleLogout} />;
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="satin-logo">✧*｡ Satin Road ｡*✧</h1>
                <p className="satin-tagline">
                    🎀 The cutie-patootie illicit underground market • est. 2004 🎀
                </p>
            </header>

            <main>{renderScreen()}</main>
        </div>
    );
}