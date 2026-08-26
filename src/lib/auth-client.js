import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://saifu-backend.instanclay.workers.dev",
    fetchOptions: {
        credentials: "include",
    },
});

export const { signIn, signOut, useSession } = authClient;

