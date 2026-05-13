import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface ShopLayoutProps {
    children: ReactNode;
    cartCount?: number;
    onCartClick?: () => void;
}

export default function ShopLayout({
    children,
    cartCount = 0,
    onCartClick,
}: ShopLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <Link href="/shop" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
                                <svg
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                EuroMarket
                            </span>
                        </Link>
                        <nav className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                            >
                                Home
                            </Link>
                            {onCartClick && (
                                <button
                                    onClick={onCartClick}
                                    className="relative rounded-lg bg-gray-100 p-2 transition hover:bg-gray-200"
                                >
                                    <svg
                                        className="h-5 w-5 text-gray-700"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                        />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="mt-16 border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-sm text-gray-500">
                            &copy; EuroMarket
                        </p>
                        <p className="text-sm text-gray-400">
                            Powered by IdentID
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
