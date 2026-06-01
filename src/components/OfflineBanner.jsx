"use client";

import { useState, useEffect, useCallback } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(false);
    const [showReconnected, setShowReconnected] = useState(false);
    const [hasBeenOffline, setHasBeenOffline] = useState(false);

    const handleOffline = useCallback(() => {
        setIsOffline(true);
        setHasBeenOffline(true);
        setShowReconnected(false);
    }, []);

    const handleOnline = useCallback(() => {
        setIsOffline(false);
        if (hasBeenOffline) {
            setShowReconnected(true);
            setTimeout(() => setShowReconnected(false), 3000);
        }
    }, [hasBeenOffline]);

    useEffect(() => {
        // Set initial state
        if (typeof navigator !== "undefined" && !navigator.onLine) {
            setIsOffline(true);
            setHasBeenOffline(true);
        }

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, [handleOffline, handleOnline]);

    if (!isOffline && !showReconnected) return null;

    return (
        <div
            className="offline-banner"
            role="status"
            aria-live="polite"
            style={{
                position: "fixed",
                top: "env(safe-area-inset-top, 0px)",
                left: 0,
                right: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.625rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                animation: "offlineBannerSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                ...(isOffline
                    ? {
                          background: "rgba(239, 68, 68, 0.12)",
                          borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
                          color: "#fca5a5",
                      }
                    : {
                          background: "rgba(34, 197, 94, 0.12)",
                          borderBottom: "1px solid rgba(34, 197, 94, 0.2)",
                          color: "#86efac",
                      }),
            }}
        >
            {isOffline ? (
                <>
                    <WifiOff size={15} />
                    <span>Anda sedang offline. Beberapa fitur sinkronisasi dinonaktifkan sementara.</span>
                </>
            ) : (
                <>
                    <Wifi size={15} />
                    <span>Kembali online!</span>
                </>
            )}

            <style jsx global>{`
                @keyframes offlineBannerSlideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
