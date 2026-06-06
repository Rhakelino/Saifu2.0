import { getTransactions } from "@/actions/transaction-actions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const transactions = await getTransactions();
        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch transactions" },
            { status: error.message === "Unauthorized" ? 401 : 500 }
        );
    }
}
