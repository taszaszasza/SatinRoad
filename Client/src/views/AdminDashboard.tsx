import { Window } from "@/components/Window.tsx";
import { type UserDto } from "../../Api.ts";

interface AdminDashboardProps {
    currentUser: UserDto;
    onLogout: () => void;
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
    return (
        <Window title="Admin_Terminal.exe" onClose={onLogout}>
            <div className="text-center">
                <h2>👑 Boss Control Room</h2>
                <p>Logged in as: <strong>@{currentUser.userName}</strong></p>
                <div className="status-badge status-online" style={{ margin: "16px 0" }}>
                    Role: Underworld Boss / Admin
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