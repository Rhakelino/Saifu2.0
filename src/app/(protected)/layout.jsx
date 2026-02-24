import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ProtectedLayout({ children }) {
    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
            <Footer />
        </div>
    );
}
