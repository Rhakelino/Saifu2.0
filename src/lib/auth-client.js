import { createAuthClient } from "better-auth/react";

function getSessionToken() {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
        for (const prefix of ["__Secure-better-auth.session_token=", "better-auth.session_token="]) {
            if (cookie.startsWith(prefix)) {
                return cookie.slice(prefix.length);
            }
        }
    }
    return null;
}

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://saifu-backend.instanclay.workers.dev",
    fetchOptions: {
        credentials: "include",
        onRequest(ctx) {
            const token = getSessionToken();
            if (token) {
                ctx.options.headers = {
                    ...ctx.options.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        },
    },
});

export const { signIn, signOut, useSession } = authClient;

