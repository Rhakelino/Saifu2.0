"use server";

import { db } from "@/lib/db";
import { wallets, transactions } from "@/schema/schema";
import { getSession } from "@/lib/session";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getWallets() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const userWallets = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userId, session.user.id))
        .orderBy(wallets.createdAt);

    const walletsWithBalance = await Promise.all(
        userWallets.map(async (wallet) => {
            const balance = await getWalletBalance(wallet.id);
            return { ...wallet, balance };
        })
    );

    return walletsWithBalance;
}

export async function getWalletBalance(walletId) {
    const result = await db
        .select({
            income: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} WHEN ${transactions.type} = 'transfer' AND ${transactions.toWalletId} = ${walletId} THEN ${transactions.amount} ELSE 0 END), 0)`,
            expense: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} WHEN ${transactions.type} = 'transfer' AND ${transactions.walletId} = ${walletId} THEN ${transactions.amount} ELSE 0 END), 0)`,
        })
        .from(transactions)
        .where(
            sql`(${transactions.walletId} = ${walletId} OR ${transactions.toWalletId} = ${walletId})`
        );

    return Number(result[0].income) - Number(result[0].expense);
}

export async function createWallet(formData) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const name = formData.get("name");
    const type = formData.get("type");

    if (!name || !type) throw new Error("Name and type are required");

    await db.insert(wallets).values({
        userId: session.user.id,
        name,
        type,
    });

    revalidatePath("/wallet");
    revalidatePath("/dashboard");
}

export async function updateWallet(formData) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const id = formData.get("id");
    const name = formData.get("name");
    const type = formData.get("type");

    await db
        .update(wallets)
        .set({ name, type })
        .where(and(eq(wallets.id, id), eq(wallets.userId, session.user.id)));

    revalidatePath("/wallet");
    revalidatePath("/dashboard");
}

export async function deleteWallet(walletId) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await db
        .delete(wallets)
        .where(and(eq(wallets.id, walletId), eq(wallets.userId, session.user.id)));

    revalidatePath("/wallet");
    revalidatePath("/dashboard");
}
