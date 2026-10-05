import {Role} from "../../Api.ts";

interface RoleSwitcherProps {
    currentRole: Role;
    onRoleChange: (newRole: Role) => void;
}

export function RoleSwitcher({currentRole, onRoleChange}: RoleSwitcherProps){
    return(
        <div className = "role-toggle-container">
            <div className = "role-toggle">
                <button type = "button"
                className={currentRole === Role.User? 'active' : ''}
                onClick={() => onRoleChange(Role.User)}>
                    🛍️ Criminal
                </button>
                <button
                    type="button"
                    className={currentRole === Role.Admin ? 'active' : ''}
                    onClick={() => onRoleChange(Role.Admin)}
                >
                    👑 Big Boss
                </button>
            </div>
        </div>
    );
}