"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Returns a key that changes every time the pathname changes or the
 * component mounts. Use as a `key` prop on animated wrappers to force
 * React to create a fresh DOM element, ensuring CSS animations always
 * replay — even when the page is served from cache.
 *
 * Usage:
 *   const animKey = useAnimationKey();
 *   return <div key={animKey} className="animate-fade-in">...</div>
 */
export function useAnimationKey() {
    const pathname = usePathname();
    const [key, setKey] = useState(() => `${pathname}-${Date.now()}`);

    useEffect(() => {
        setKey(`${pathname}-${Date.now()}`);
    }, [pathname]);

    return key;
}
