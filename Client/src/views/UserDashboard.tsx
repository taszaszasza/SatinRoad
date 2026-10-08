import { Window } from "../components/Window.tsx";
import {Api, type UserDto } from "../../Api.ts";
import {NavBar, type NavTab} from "../components/NavBar.tsx";
import {useState} from "react";
import {MyProfileTab} from "@/views/MyProfileTab.tsx";
import {ShoppingTab} from "@/views/ShoppingTab.tsx";

const MyApi = new Api();

interface UserDashboardProps {
    currentUser: UserDto;
    onLogout: () => void;
}

export function UserDashboard({ currentUser: initalUser, onLogout }: UserDashboardProps) {
    const [tab, setTab] = useState<NavTab>("shopping");
    const [currentUser, setCurrentUser] = useState<UserDto>(initalUser);

    function refreshCurrentUser() {
        if (!currentUser?.userId) return;

        MyApi.getUserById.userGetUserById({ userId: currentUser.userId }).then((res) => {
            setCurrentUser(res.data);
        }).catch((err) => {
            console.error("Failed to refresh profile", err);
        });
    }
    return (
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
            <NavBar
                currentUser={currentUser}
                activeTab={tab}
                onTabChange={setTab}
                onLogout={onLogout}></NavBar>

                {tab === "shopping" && (
                    <ShoppingTab currentUser={initalUser} isMyShop={false}></ShoppingTab>
                )}

            {tab === "your-shop" && (
                <ShoppingTab currentUser={initalUser} isMyShop={true}></ShoppingTab>
            )}

                {tab === "profile" && (
                <MyProfileTab currentUser={currentUser} onProfileUpdated={refreshCurrentUser} />
            )}
        </div>
    );
}