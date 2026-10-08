import { useState } from "react";
import type { UserDto } from "../../Api.ts";
import { ManageUsersTab } from "./ManageUsersTab.tsx";
import { ManageCategoriesTab } from "./ManageCategoriesTab.tsx";

interface ManagementTabProps {
    currentUser: UserDto;
}

export function ManagementTab({ currentUser }: ManagementTabProps) {
    const [subTab, setSubTab] = useState<"users" | "categories">("users");

    return (
        <div>
            <div className="role-toggle-container" style={{ marginBottom: "20px" }}>
                <div className="role-toggle">
                    <button
                        type="button"
                        className={subTab === "users" ? "active" : ""}
                        onClick={() => setSubTab("users")}
                    >
                        👥 Users
                    </button>
                    <button
                        type="button"
                        className={subTab === "categories" ? "active" : ""}
                        onClick={() => setSubTab("categories")}
                    >
                        🏷️ Categories
                    </button>
                </div>
            </div>
            {subTab === "users" && <ManageUsersTab currentUser={currentUser} />}
            {subTab === "categories" && <ManageCategoriesTab />}
        </div>
    );
}