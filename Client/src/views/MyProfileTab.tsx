import { useState } from "react";
import { Role, type UserDto } from "../../Api.ts";
import { EditUserWindow } from "@/components/EditUserWindow.tsx";

interface MyProfileTabProps {
    currentUser: UserDto;
    onProfileUpdated: () => void;
}

export function MyProfileTab({ currentUser, onProfileUpdated }: MyProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const isAdmin = currentUser.role === Role.Admin;

    return (
        <div style={{ maxWidth: "480px", margin: "24px auto 0 auto" }}>
            <div className="y2k-window">
                <div className="y2k-window-header">
                    <div className="y2k-window-controls">
                        <span className="y2k-control-dot" />
                        <span className="y2k-control-dot" />
                        <span className="y2k-control-dot" />
                    </div>
                    <span className="y2k-window-title">Your profile</span>
                </div>

                <div
                    className="y2k-window-body text-center"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}
                >
                    <div
                        style={{
                            width: "96px",
                            height: "96px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3px solid #ff4d94",
                            boxShadow: "0 8px 24px rgba(255, 20, 147, 0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, #ffd1e6, #ffa2cb)",
                            fontSize: "2.4rem",
                            fontWeight: 800,
                            color: "#ff1493",
                        }}
                    >
                        {currentUser.avatarUrl ? (
                            <img
                                src={currentUser.avatarUrl}
                                alt={currentUser.userName}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            currentUser.userName?.charAt(0).toUpperCase() || "?"
                        )}
                    </div>

                    <h2 style={{ margin: "4px 0 0 0", fontFamily: "'Space Grotesk', sans-serif" }}>
                        @{currentUser.userName}
                    </h2>

                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <span className={`badge-role ${isAdmin ? "badge-admin" : "badge-user"}`}>
              {isAdmin ? "Admin" : "User"}
            </span>
                        <span className={`badge-status ${currentUser.isBanned ? "status-banned" : "status-active"}`}>
              {currentUser.isBanned ? "Banned" : "Active"}
            </span>
                    </div>

                    <div style={{ marginTop: "12px", width: "100%" }}>
                        <button
                            type="button"
                            className="y2k-btn y2k-btn-block"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Your Profile
                        </button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <EditUserWindow
                    user={currentUser}
                    onClose={() => setIsEditing(false)}
                    onSuccess={() => {
                        setIsEditing(false);
                        onProfileUpdated();
                    }}
                    canEditRole={false}
                />
            )}
        </div>
    );
}