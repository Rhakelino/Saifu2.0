import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/schema/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 hari (dalam detik)
        updateAge: 60 * 60 * 24, // Update session setiap 1 hari
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // Cache 5 menit (mengurangi DB calls)
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
});
