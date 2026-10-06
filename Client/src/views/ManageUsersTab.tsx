import {type ReactNode, useEffect, useState} from "react";
import {SearchBar} from "@/components/SearchBar.tsx";
import {Card} from "@/components/Card.tsx";
import {Api, Role, type UserDto} from "../../Api.ts"
import {EditUserWindow} from "@/components/EditUserWindow.tsx";

interface ManageUsersTabProps {
    currentUser?: UserDto
}

export function ManageUsersTab({currentUser}: ManageUsersTabProps) {
    const [searchValue, setSearchValue] = useState("");
    const [users, setUsers] = useState<UserDto[]>([]);
    const [editingUser, setEditingUser] = useState<UserDto | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const MyApi = new Api();

    interface ManageUsersTabProps {
        currentUser: UserDto;
    }

    useEffect(() => {
        MyApi.getUsers.userGetUsers().then(r => {
            const data = r.data;
            setUsers(data);
        });
    }, []);

    function loadUsers() {
        MyApi.getUsers.userGetUsers().then((r) => {
            setUsers(r.data);
        });
    }

    useEffect(() => {
        loadUsers();
    }, []);

    function toggleBan(userId: number | undefined) {
        MyApi.banUser.userBanUser({userId}).then(() => {
            loadUsers();
        }).catch((err) => {
            console.error("Ban toggle failed", err);
        });
    }

    function deleteUser(userId: number | undefined) {
        MyApi.deleteUser.userDeleteUser({userId}).then(() => {
            loadUsers();
        }).catch((err) => {
            console.error("Delete user failed", err);
        });
    }
    
    

    const filteredUsers = users.filter((u) => (u.userName ?? "").toLowerCase().includes(searchValue.toLowerCase()));

    return (
        <div className="manage-users-tab" style={{marginTop: "16px"}}>
            <div className="toolbar-row">
                <SearchBar
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search agents by username..."
                />

                <button
                    type="button"
                    className="y2k-btn"
                    onClick={() => setIsCreating(true)}
                >
                    +
                </button>
            </div>

            <div className="user-list">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const isAdmin = user.role === Role.Admin;

                        return (
                            <Card
                                key={user.userId}
                                image={ user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.userName ?? "Avatar"}
                                        className="user-card-avatar"
                                        style={{ objectFit: "cover" }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                            e.currentTarget.parentElement?.classList.add("avatar-fallback");
                                        }}
                                    />
                                    ) : (
                                    <div className="user-card-avatar">
                                        {user.userName?.charAt(0).toUpperCase() || "?"}
                                    </div>)}
                                
                                title={`@${user.userName}`}
                                tags={
                                    <>
                    <span className={`badge-role ${isAdmin ? "badge-admin" : "badge-user"}`}>
                      {isAdmin ? "Admin" : "User"}
                    </span>
                                        <span
                                            className={`badge-status ${user.isBanned ? "status-banned" : "status-active"}`}>
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                                    </>
                                }
                                subtitle={
                                    undefined}
                                actions={
                                    <>

                                        <button
                                            type="button"
                                            className="y2k-btn-action"
                                            onClick={() => setEditingUser(user)
                                            }
                                        > Update
                                        </button>
                                        

                                        <button
                                            type="button"
                                            className="y2k-btn-action"
                                            disabled={user.userId === currentUser?.userId}

                                            onClick={() => {
                                                deleteUser(user.userId)
                                            }}
                                        >
                                            Delete
                                        </button>

                                        <button
                                            type="button"
                                            className={`y2k-btn-action ${user.isBanned ? "btn-unban" : "btn-ban"}`}
                                            disabled={isAdmin}
                                            title={isAdmin ? "Admins cannot be banned" : undefined}
                                            onClick={() => {
                                                toggleBan(user.userId)
                                            }}
                                        >
                                            {isAdmin ? "Ban" : user.isBanned ? "Unban" : "Ban"}
                                        </button>

                                    </>

                                }
                            />
                        );
                    })
                ) : (
                    <p style={{textAlign: "center", color: "#888", padding: "20px 0"}}>
                        No agents found.
                    </p>
                )}
            </div>
            {editingUser && (
                <EditUserWindow
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSuccess={loadUsers} />) }
            {isCreating && (
                <EditUserWindow
                    user={null}
                    onClose={() => setIsCreating(false)}
                    onSuccess={loadUsers} />) }
        </div>
    );
}  