import { Window } from "@/components/Window.tsx";
import { type UserDto } from "../../Api.ts";

interface UserDashboardProps {
    currentUser: UserDto;
    onLogout: () => void;
}

export function UserDashboard({ currentUser, onLogout }: UserDashboardProps) {
    return (
        <Window title="Shopper_Dashboard.exe" onClose={onLogout}>
            <div className="text-center">
                <h2>🛍️ Shopper Home</h2>
                <p>Logged in as: <strong>@{currentUser.userName}</strong></p>
                <div className="status-badge status-online" style={{ margin: "16px 0" }}>
                    Role: Regular Shopper
                </div>
                <div>
                    <button type="button" className="y2k-btn" onClick={onLogout}>
                        Log Out
                    </button>
                </div>
            </div>
        </Window>
    );
}