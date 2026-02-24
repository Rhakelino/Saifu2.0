"use server";

import { db } from "@/lib/db";
import { transactions } from "@/schema/schema";
import { getSession } from "@/lib/session";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTransactions(walletId) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const where = walletId
        ? and(eq(transactions.userId, session.user.id), eq(transactions.walletId, walletId))
        : eq(transactions.userId, session.user.id);

    const result = await db
        .select()
        .from(transactions)
        .where(where)
        .orderBy(desc(transactions.createdAt));

    return result;
}

export async function createTransaction(formData) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const walletId = formData.get("walletId");
    const type = formData.get("type");
    const amount = parseInt(formData.get("amount"), 10);
    const description = formData.get("description");

    if (!walletId || !type || !amount) {
        throw new Error("Wallet, type, and amount are required");
    }

    await db.insert(transactions).values({
        walletId,
        userId: session.user.id,
        type,
        amount,
        description: description || null,
    });

    revalidatePath("/dashboard");
    revalidatePath("/wallet");
}

export async function transferBetweenWallets(formData) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const fromWalletId = formData.get("fromWalletId");
    const toWalletId = formData.get("toWalletId");
    const amount = parseInt(formData.get("amount"), 10);
    const description = formData.get("description") || "Transfer antar dompet";

    if (!fromWalletId || !toWalletId || !amount) {
        throw new Error("Source wallet, destination wallet, and amount are required");
    }

    if (fromWalletId === toWalletId) {
        throw new Error("Cannot transfer to the same wallet");
    }

    await db.insert(transactions).values({
        walletId: fromWalletId,
        toWalletId: toWalletId,
        userId: session.user.id,
        type: "transfer",
        amount,
        description: description || null,
    });

    revalidatePath("/dashboard");
    revalidatePath("/wallet");
}

export async function deleteTransaction(transactionId) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await db
        .delete(transactions)
        .where(
            and(
                eq(transactions.id, transactionId),
                eq(transactions.userId, session.user.id)
            )
        );

    revalidatePath("/dashboard");
    revalidatePath("/wallet");
}
