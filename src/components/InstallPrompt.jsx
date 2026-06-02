"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, X, Share } from "lucide-react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
            setIsInstalled(true);
            return;
        }

        // Check if dismissed permanently
        const dismissed = localStorage.getItem("pwa-install-dismissed");
        if (dismissed) {
            return;
        }

        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        if (isIOSDevice) {
            // iOS doesn't fire beforeinstallprompt, show custom instructions
            setTimeout(() => setShowPrompt(true), 3000);
            return;
        }

        // Listen for beforeinstallprompt (Chrome, Edge, Brave, Samsung Internet)
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Small delay so the page loads first
            setTimeout(() => setShowPrompt(true), 2000);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Listen for successful install
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = useCallback(async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    }, [deferredPrompt]);

    const handleDismiss = useCallback(() => {
        setShowPrompt(false);
        localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    }, []);

    if (isInstalled || !showPrompt) return null;

    return (
        <div
            className="install-prompt"
            role="alert"
            style={{
                position: "fixed",
                bottom: "5.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9998,
                width: "calc(100% - 2rem)",
                maxWidth: "420px",
                background: "rgba(24, 24, 27, 0.95)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(63, 63, 70, 0.5)",
                borderRadius: "1rem",
                padding: "1rem 1.125rem",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)",
                animation: "installPromptSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Close button */}
            <button
                onClick={handleDismiss}
                aria-label="Tutup"
                style={{
                    position: "absolute",
                    top: "0.625rem",
                    right: "0.625rem",
                    background: "none",
                    border: "none",
                    color: "#71717a",
                    cursor: "pointer",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.375rem",
                    transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#fafafa")}
                onMouseLeave={(e) => (e.target.style.color = "#71717a")}
            >
                <X size={16} />
            </button>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                {/* App icon */}
                <img
                    src="/favicon/android-chrome-192x192.png"
                    alt="Saifu"
                    width={48}
                    height={48}
                    style={{
                        borderRadius: "0.75rem",
                        flexShrink: 0,
                        border: "1px solid rgba(63, 63, 70, 0.4)",
                    }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                        style={{
                            fontSize: "0.9375rem",
                            fontWeight: 600,
                            color: "#fafafa",
                            margin: "0 0 0.25rem 0",
                            paddingRight: "1.5rem",
                        }}
                    >
                        Install Saifu
                    </h3>
                    <p
                        style={{
                            fontSize: "0.8125rem",
                            color: "#a1a1aa",
                            margin: 0,
                            lineHeight: 1.4,
                        }}
                    >
                        {isIOS
                            ? "Akses instan dari homescreen tanpa buka browser."
                            : "Akses instan dari homescreen, lebih cepat & bisa offline."}
                    </p>

                    {isIOS ? (
                        <p
                            style={{
                                fontSize: "0.75rem",
                                color: "#71717a",
                                margin: "0.5rem 0 0 0",
                                lineHeight: 1.5,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                flexWrap: "wrap",
                            }}
                        >
                            Tap <Share size={13} style={{ color: "#60a5fa", flexShrink: 0 }} /> lalu pilih{" "}
                            <strong style={{ color: "#e4e4e7" }}>&quot;Add to Home Screen&quot;</strong>
                        </p>
                    ) : (
                        <button
                            onClick={handleInstall}
                            style={{
                                marginTop: "0.75rem",
                                background: "#fafafa",
                                color: "#09090b",
                                border: "none",
                                borderRadius: "0.5rem",
                                padding: "0.5rem 1.125rem",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                transition: "all 0.15s ease",
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = "#e4e4e7";
                                e.target.style.boxShadow = "0 0 20px rgba(255,255,255,0.08)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "#fafafa";
                                e.target.style.boxShadow = "none";
                            }}
                        >
                            <Download size={14} />
                            Install
                        </button>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes installPromptSlideUp {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(1rem);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
