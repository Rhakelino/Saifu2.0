import { getWallets } from "@/actions/wallet-actions";
import { getTransactions } from "@/actions/transaction-actions";
import WalletPageClient from "./WalletPageClient";

export default async function WalletPage() {
    const [wallets, transactions] = await Promise.all([
        getWallets(),
        getTransactions(),
    ]);

    return <WalletPageClient wallets={wallets} transactions={transactions} />;
}
