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

    if (userWallets.length === 0) return [];

    // Fetch all balances in a single query instead of N+1
    const walletIds = userWallets.map((w) => w.id);
    const balanceResults = await db
        .select({
            walletId: transactions.walletId,
            income: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)`,
            expense: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)`,
            transferOut: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'transfer' THEN ${transactions.amount} ELSE 0 END), 0)`,
        })
        .from(transactions)
        .where(sql`${transactions.walletId} IN (${sql.join(walletIds.map(id => sql`${id}`), sql`, `)})`)
        .groupBy(transactions.walletId);

    // Also get incoming transfers
    const transferInResults = await db
        .select({
            walletId: transactions.toWalletId,
            transferIn: sql`COALESCE(SUM(${transactions.amount}), 0)`,
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.type, "transfer"),
                sql`${transactions.toWalletId} IN (${sql.join(walletIds.map(id => sql`${id}`), sql`, `)})`
            )
        )
        .groupBy(transactions.toWalletId);

    const balanceMap = {};
    balanceResults.forEach((r) => {
        balanceMap[r.walletId] = Number(r.income) - Number(r.expense) - Number(r.transferOut);
    });
    transferInResults.forEach((r) => {
        balanceMap[r.walletId] = (balanceMap[r.walletId] || 0) + Number(r.transferIn);
    });

    return userWallets.map((w) => ({
        ...w,
        balance: balanceMap[w.id] || 0,
    }));
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
