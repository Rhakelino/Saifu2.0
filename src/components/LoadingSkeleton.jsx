"use client";

export function DashboardSkeleton() {
    return (
        <div className="animate-fade-in">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="card relative overflow-hidden p-5">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-4 w-20 bg-muted rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                                <div className="w-8 h-8 rounded-xl bg-muted/20" />
                            </div>
                            <div className="h-8 w-32 bg-muted rounded mb-1 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                            <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.2s' }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Add Transaction Form Skeleton */}
                    <div className="card">
                        <div className="h-6 w-40 bg-muted rounded mb-4 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                        <div className="space-y-3">
                            <div>
                                <div className="h-4 w-16 bg-muted/50 rounded mb-2 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                                <div className="h-10 w-full bg-muted rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                            </div>
                            <div>
                                <div className="h-4 w-16 bg-muted/50 rounded mb-2 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                                <div className="h-10 w-full bg-muted rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                            </div>
                            <div>
                                <div className="h-4 w-16 bg-muted/50 rounded mb-2 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                                <div className="h-10 w-full bg-muted rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                            </div>
                            <div className="h-10 w-full bg-muted rounded mt-4 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.2s' }} />
                        </div>
                    </div>
                </div>

                {/* Right Column Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart Skeleton */}
                    <div className="card">
                        <div className="h-6 w-32 bg-muted rounded mb-4 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                        <div className="h-48 w-full bg-muted/30 rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                    </div>

                    {/* Transactions Skeleton */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 w-40 bg-muted rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                            <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                        </div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted/30 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                                        <div>
                                            <div className="h-4 w-24 bg-muted/50 rounded mb-1 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                                            <div className="h-3 w-16 bg-muted/30 rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.2s' }} />
                                        </div>
                                    </div>
                                    <div className="h-4 w-20 bg-muted rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function WalletSkeleton() {
    return (
        <div className="animate-fade-in">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="h-8 w-32 bg-muted rounded mb-2 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                    <div className="h-5 w-48 bg-muted/50 rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                </div>
                <div className="h-10 w-36 bg-muted rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
            </div>

            {/* Wallet Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-6 w-24 bg-muted rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                            <div className="w-8 h-8 rounded-lg bg-muted/30 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                        </div>
                        <div className="h-8 w-32 bg-muted rounded mb-2 animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.1s' }} />
                        <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.2s' }} />
                        <div className="flex gap-2 mt-4">
                            <div className="h-8 w-20 bg-muted/30 rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.2s' }} />
                            <div className="h-8 w-20 bg-muted/30 rounded animate-pulse" style={{ animation: 'skeleton-loading 1.5s ease-in-out infinite 0.3s' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
