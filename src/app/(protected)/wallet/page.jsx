import { getWallets } from "@/actions/wallet-actions";
import { getTransactions } from "@/actions/transaction-actions";
import { getSession } from "@/lib/session";
import WalletPageClient from "./WalletPageClient";

export default async function WalletPage() {
    const [wallets, transactions, session] = await Promise.all([
        getWallets(),
        getTransactions(),
        getSession(),
    ]);

    return (
        <WalletPageClient
            wallets={wallets}
            transactions={transactions}
            user={session?.user}
            totalBalance={wallets.reduce((sum, w) => sum + (w.balance || 0), 0)}
            totalIncome={transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)}
            totalExpense={transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)}
        />
    );
}
