import { useState } from "react";
import { Api, Role, type UserDto } from "../../Api.ts";

const MyApi = new Api();

interface EditUserWindowProps {
    user?: UserDto | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditUserWindow({user, onClose, onSuccess}: EditUserWindowProps)
{
    const isEditing = Boolean(user&&user.userId);

    const [userName, setUserName] = useState(user?.userName ?? "");
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
    const [role, setRole] = useState<Role>(user?.role ?? Role.User);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleSave() {

        setLoading(true);
        setError(null);

        if (isEditing) {
            MyApi.updateUser.userUpdateUser({
                id: user!.userId,
                UserName: userName,
                AvatarUrl: avatarUrl.trim() || null,
                Role: role,
            }).then(() => {
                setLoading(false);
                onSuccess();
                onClose();
            }).catch((err: any) => {
                setLoading(false);
                setError(err?.error?.title || "Failed to update agent");
            });
    } else {
        MyApi.createUser.userCreateUser({
            UserName: userName,
            AvatarUrl: avatarUrl.trim() || null,
            Role: role,
        }).then(() => {
            setLoading(false);
            onSuccess();
            onClose();
        }).catch((err: any) => {
            setLoading(false);
            setError(err?.error?.title || "Failed to create agent");
        });
    }
        
    }

    return (
        <div className="y2k-modal-backdrop" onClick={onClose}>
            <div
                className="y2k-window y2k-window-modal"
                style={{ width: "100%" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header bar matching your app design */}
                <div className="y2k-window-header">
                    <div className="y2k-window-controls">
                        <span className="y2k-control-dot close" onClick={onClose} title="Close" />
                        <span className="y2k-control-dot" />
                        <span className="y2k-control-dot" />
                    </div>
                    <span className="y2k-window-title">Edit Agent — @{user?.userName}</span>
                </div>

                {/* Body using your existing form styles */}
                <div className="y2k-window-body">
                    {error && (
                        <div className="error-container">
                            <span className="badge-status status-banned">{error}</span>
                        </div>
                    )}

                    <div className="y2k-form-group">
                        <label className="y2k-label">Username</label>
                        <input
                            type="text"
                            className="y2k-input"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>

                    <div className="y2k-form-group">
                        <label className="y2k-label">Avatar URL</label>
                        <input
                            type="text"
                            className="y2k-input"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="y2k-form-group">
                        <label className="y2k-label">Role</label>
                        <select
                            className="y2k-select"
                            value={role}
                            onChange={(e) => setRole(Number(e.target.value) as Role)}
                        >
                            <option value={Role.User}>User</option>
                            <option value={Role.Admin}>Admin</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                        <button
                            type="button"
                            className="y2k-btn y2k-btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="y2k-btn"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}