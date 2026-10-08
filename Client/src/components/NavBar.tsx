import {Role, type UserDto} from "../../Api.ts";
import {SatinLogo} from "@/components/Logo.tsx";

export type NavTab = "shopping" | "your-shop" | "profile" | "manage-users";

interface NavBarProps {
    currentUser: UserDto;
    activeTab: NavTab;
    onTabChange: (tab: NavTab) => void;
    onLogout: () => void;
}

export function NavBar({currentUser, activeTab, onLogout, onTabChange}: NavBarProps) {
    const isAdmin = currentUser.role === Role.Admin;
    
    return (
        <nav className="y2k-navbar">
            <div className = "navbar-brand">
                <SatinLogo height={32}></SatinLogo>
            </div>
            
            <div className = "navbar-menu">
                
                <button type="button"
                className={`navbar-item ${activeTab === "shopping" ? "active" : ""}`}
                onClick={() => onTabChange("shopping")}>
                    Go Shopping
                </button>

                <button
                    type="button"
                    className={`navbar-item ${activeTab === "your-shop" ? "active" : ""}`}
                    onClick={() => onTabChange("your-shop")}
                >
                    Your Shop
                </button>

                <button
                    type="button"
                    className={`navbar-item ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => onTabChange("profile")}
                >
                    Your Profile
                </button>
                
                {isAdmin && (
                    <button
                        type="button"
                        className={`navbar-item navbar-admin-item ${activeTab === "manage-users" ? "active" : ""}`}
                        onClick={() => onTabChange("manage-users")}
                    >
                        👑 Management
                    </button>
                )}
            </div>

            <div className="navbar-actions">
                <button type="button" className="y2k-btn y2k-btn-exit" onClick={onLogout}>
                    Log out
                </button>
            </div>
            
        </nav>
    );
}