import {Api, Role, type UserDto} from "../../Api.ts";
import {type FormEvent, useState} from "react";
import {RoleSwitcher} from "@/components/RoleSwitcher.tsx";
import {Window} from "@/components/Window.tsx";

const MyApi = new Api();


interface LoginViewProps {
    onLoginSuccess: (user: UserDto ) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState<Role>(Role.User);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) return;

        setLoading(true);
        setError(null);


        try {
            const res = await MyApi.login.userLogin({Username: userName.trim(), SelectedRole: role});
            if (res.data) {
                onLoginSuccess(res.data);
            }
        } catch (error: any) {
            const message = error?.error?.detail || error?.response?.data?.detail || error?.detail;
            setError(message || 'Access Denied');        
        } finally {
            setLoading(false);
        }
    }
        

return (
    <Window title = "Please log in, fellow criminal" >
        <RoleSwitcher currentRole={role} onRoleChange={setRole}></RoleSwitcher>
        {error && (
            <div className = "error-container">
            <div className="status-badge status-offline">
            {error}
            </div>
        </div> )}
            
        
        <form onSubmit={handleSubmit}>
            <div className="y2k-form-group">
                <label className="y2k-label"> Agent Codename</label>
                <input type="text"
                className="y2k-input"
                placeholder="Your login"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required></input>
            </div>
            
            <button type = "submit"
            className="y2k-btn y2k-btn-block"
            disabled = {loading}>
                {loading? 'Loading...' : 'Enter the Secret Shop'}
            </button>
        </form>
        
    </Window>
);

}