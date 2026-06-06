import { getWallets } from "@/actions/wallet-actions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const wallets = await getWallets();
        return NextResponse.json(wallets);
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch wallets" },
            { status: error.message === "Unauthorized" ? 401 : 500 }
        );
    }
}
