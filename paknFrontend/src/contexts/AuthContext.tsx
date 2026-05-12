import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken, guestLogin as guestLoginApi } from "@/api/user/authApi";
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

    guestLogin: () => Promise<void>;
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
    const isAuthenticated = !!token || !!localStorage.getItem("token");
    // =========================
    // 🔥 SYNC TOKEN -> AXIOS
    // =========================
    useEffect(() => {
        if (token) {
            setAuthToken(token);
        }
    }, [token]);
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     const user = localStorage.getItem("user");
    //     const permissions = localStorage.getItem("permissions");

    //     if (token) {
    //         setToken(token);
    //         setAuthToken(token);
    //     }

    //     if (user) {
    //         setUser(JSON.parse(user));
    //     }

    //     if (permissions) {
    //         setPermissions(JSON.parse(permissions));
    //     }

    //     setLoading(false);
    // }, [token]);
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
    const guestLogin = async () => {
        try {

            const data = await guestLoginApi();

            const guestUser: GuestUser = {
                HoTen: "Khách",
                isGuest: true,
            };

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(guestUser));
            localStorage.setItem("permissions", JSON.stringify([]));

            setAuthToken(data.token);

            setToken(data.token);
            setUser(guestUser);
            setPermissions([]);

        } catch (error) {
            console.error("Guest login failed:", error);
        }
    };    // =========================
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
                isAuthenticated: isAuthenticated,
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