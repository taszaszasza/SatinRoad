import { useState } from "react";
import { Role, type UserDto } from "../../Api.ts";
import { EditUserWindow } from "@/components/EditUserWindow.tsx";
import { Window } from "@/components/Window.tsx";

interface MyProfileTabProps {
    currentUser: UserDto;
    onProfileUpdated: () => void;
}

export function MyProfileTab({ currentUser, onProfileUpdated }: MyProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const isAdmin = currentUser.role === Role.Admin;

    return (
        <div style={{ maxWidth: "480px", margin: "24px auto 0 auto" }}>
            <Window title="ID Card">
                <div
                    className="text-center"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}
                >
                    <div className="user-card-avatar" style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
                        {currentUser.avatarUrl ? (
                            <img
                                src={currentUser.avatarUrl}
                                alt={currentUser.userName}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            currentUser.userName?.charAt(0).toUpperCase() || "?"
                        )}
                    </div>

                    <h2 style={{ margin: "4px 0 0 0" }}>@{currentUser.userName}</h2>

                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <span className={`badge-role ${isAdmin ? "badge-admin" : "badge-user"}`}>
              {isAdmin ? "Admin" : "User"}
            </span>
                        <span className={`badge-status ${currentUser.isBanned ? "status-banned" : "status-active"}`}>
              {currentUser.isBanned ? "Banned" : "Active"}
            </span>
                    </div>

                    <button
                        type="button"
                        className="y2k-btn y2k-btn-block"
                        style={{ marginTop: "12px" }}
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Your Profile
                    </button>
                </div>
            </Window>

            {isEditing && (
                <EditUserWindow
                    user={currentUser}
                    canEditRole={false}
                    onClose={() => setIsEditing(false)}
                    onSuccess={() => {
                        setIsEditing(false);
                        onProfileUpdated();
                    }}
                />
            )}
        </div>
    );
}