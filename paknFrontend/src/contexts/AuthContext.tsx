import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "@/api/user/authApi";
import type { User } from "@/types/user";

type AuthContextType = {
    token: string | null;
    user: AuthUser | null;
    permissions: string[];
    isAuthenticated: boolean;

    login: (data: {
        token: string;
        user: User;
        permissions: string[];
    }) => void;

    guestLogin: () => void;
    logout: () => void;
};
type GuestUser = {
    HoTen: string;
    isGuest: true;
};

type AuthUser = User | GuestUser;

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {

    // =========================
    // 🔥 STATE
    // =========================
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState<AuthUser | null>(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    const [permissions, setPermissions] = useState<string[]>(() => {
        const raw = localStorage.getItem("permissions");
        return raw ? JSON.parse(raw) : [];
    });

    // =========================
    // 🔥 SYNC TOKEN -> AXIOS
    // =========================
    useEffect(() => {
        if (token) {
            setAuthToken(token);
        }
    }, [token]);

    // =========================
    // ✅ LOGIN
    // =========================
    const login = (data: {
        token: string;
        user: User;
        permissions: string[];
    }) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
        setAuthToken(data.token);
        setToken(data.token);
        setUser(data.user);
        setPermissions(data.permissions);
    };

    // =========================
    // 👤 GUEST LOGIN
    // =========================
    const guestLogin = () => {
        const guestUser: GuestUser = {
            HoTen: "Khách",
            isGuest: true,
        };

        localStorage.setItem("token", "");
        localStorage.setItem("user", JSON.stringify(guestUser));
        localStorage.setItem("permissions", JSON.stringify([]));

        setToken("");
        setUser(guestUser);
        setPermissions([]);
    };
    // =========================
    // 🚪 LOGOUT
    // =========================
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("permissions");

        setToken(null);
        setUser(null);
        setPermissions([]);

        setAuthToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                permissions,
                isAuthenticated: !!token,
                login,
                guestLogin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// =========================
// HOOK
// =========================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};