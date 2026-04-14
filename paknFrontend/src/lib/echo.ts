import Echo from "laravel-echo";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

export const createEcho = (token: string) => {
    return new Echo({
        broadcaster: "reverb",
        key: "79797979", // giống .env backend
        wsHost: "paknproj.test", // hoặc paknproj.test
        wsPort: 8080,
        forceTLS: false,

        authEndpoint: "http://paknproj.test/broadcasting/auth",

        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
};