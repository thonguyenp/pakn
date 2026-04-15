import Echo from "laravel-echo";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

export const createEcho = (token: string) => {
    return new Echo({
        broadcaster: "reverb",
        key: "njodrmsyrzajnyzjmknf", // giống .env backend
        wsHost: "127.0.0.1", // hoặc paknproj.test
        wsPort: 8080,
        forceTLS: false,
        disableStats: true,
        authEndpoint: "http://paknproj.test/broadcasting/auth",
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        },
    });
};