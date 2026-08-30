import { createAuthClient } from "better-auth/react";

function getSessionToken() {
    if (typeof document === "undefined") return "";
    const cookies = document.cookie.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
        for (const prefix of ["__Secure-better-auth.session_token=", "better-auth.session_token="]) {
            if (cookie.startsWith(prefix)) {
                return cookie.slice(prefix.length);
            }
        }
    }
    return "";
}

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://saifu-backend.instanclay.workers.dev",
    fetchOptions: {
        credentials: "include",
        auth: {
            type: "Bearer",
            token: () => getSessionToken(),
        },
    },
});

export const { signIn, signOut, useSession } = authClient;

