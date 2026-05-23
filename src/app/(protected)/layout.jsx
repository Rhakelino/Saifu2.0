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
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar wallets={wallets} />
            <main className="flex-1 w-full max-w-7xl mx-auto pb-28 md:pb-10 pt-5 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <BottomNav wallets={wallets} />
        </div>
    );
}
