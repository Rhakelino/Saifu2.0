import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata = {
    title: "Saifu — Personal Finance Manager",
    description:
        "Kelola keuangan pribadimu dengan aman, cepat, dan modern. Multi-wallet management, pencatatan transaksi, dan saldo real-time.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body suppressHydrationWarning className={`${inter.variable} antialiased`}>{children}</body>
        </html>
    );
}
