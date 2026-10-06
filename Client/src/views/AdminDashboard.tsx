import { Window } from "../components/Window.tsx";
import { type UserDto } from "../../Api.ts";
import {NavBar, type NavTab} from "../components/NavBar.tsx";
import {useState} from "react";
import {ManageUsersTab} from "@/views/ManageUsersTab.tsx";

interface AdminDashboardProps {
    currentUser: UserDto;
    onLogout: () => void;
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
    const [tab, setTab] = useState<NavTab>("shopping");
    return (
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
            <NavBar
                currentUser={currentUser}
                activeTab={tab}
                onTabChange={setTab}
                onLogout={onLogout}></NavBar>

            <div className="dashboard-content">
                {tab === "shopping" && (
                    <div className="text-center" style={{padding: "40px 0"}}>
                        <h2>🛍️️ Contraband Catalog</h2>
                        <p style={{color: "var(--text-secondary)"}}>Shopping gallery coming here next.</p>
                    </div>
                )}

                {tab === "your-shop" && (
                    <div className="text-center" style={{padding: "40px 0"}}>
                        <h2>🏷️ Merchant Stall</h2>
                        <p style={{color: "var(--text-secondary)"}}>Your listed items for sale will appear here.</p>
                    </div>
                )}

                {tab === "profile" && (
                <div className="text-center" style={{padding: "40px 0"}}>
                    <h2>👤 Agent Dossier</h2>
                    <p style={{color: "var(--text-secondary)"}}>Codename: @{currentUser.userName}</p>
                </div>
                    
                    
            )}

                {tab === "manage-users" && <ManageUsersTab currentUser={currentUser} /> }
                
            </div>
        </div>
    );
}