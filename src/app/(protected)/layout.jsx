import { getSession } from "@/lib/session";
import { getWallets } from "@/actions/wallet-actions";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default async function ProtectedLayout({ children }) {
    const session = await getSession();

    if (!session) {
        redirect("/");
    }
    
    const wallets = await getWallets();

    return (
        <div className="max-w-md mx-auto min-h-screen bg-zinc-950 shadow-2xl md:border-x border-zinc-800/50 relative overflow-hidden flex flex-col">
            <Navbar />
            <main className="flex-1 w-full overflow-y-auto pb-24 pt-4">
                <div className="px-4">
                    {children}
                </div>
            </main>
            <BottomNav wallets={wallets} />
        </div>
    );
}
