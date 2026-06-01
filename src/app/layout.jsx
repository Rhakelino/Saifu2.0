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
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Saifu",
    },
    icons: {
        icon: "/favicon/favicon-32x32.png",
        shortcut: "/favicon/favicon.ico",
        apple: "/favicon/apple-touch-icon.png",
    },
};

export const viewport = {
    themeColor: "#09090b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
};

import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body suppressHydrationWarning className={`${inter.variable} antialiased`}>
                {children}
                <Toaster theme="dark" position="bottom-center" />
            </body>
        </html>
    );
}

