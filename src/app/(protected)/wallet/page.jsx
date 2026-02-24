import { getWallets } from "@/actions/wallet-actions";
import WalletPageClient from "./WalletPageClient";

export default async function WalletPage() {
    const wallets = await getWallets();

    return <WalletPageClient wallets={wallets} />;
}
