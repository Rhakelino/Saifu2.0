import { getSession } from "@/lib/session";
import { getWallets } from "@/actions/wallet-actions";
import { getTransactions } from "@/actions/transaction-actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await getSession();
    const wallets = await getWallets();
    const transactions = await getTransactions();

    const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <DashboardClient
            user={session.user}
            wallets={wallets}
            transactions={transactions}
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
        />
    );
}
