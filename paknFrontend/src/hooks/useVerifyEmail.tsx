import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const useVerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = searchParams.get("token");

        if (t) {
            setToken(t);
            navigate(window.location.pathname, { replace: true });
        }
    }, []);

    return { token, setToken };
};