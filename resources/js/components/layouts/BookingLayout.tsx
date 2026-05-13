import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface BookingLayoutProps {
    children: ReactNode;
}

export default function BookingLayout({ children }: BookingLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-[#003580] text-white">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
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
                                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold">EuroStay</span>
                        </Link>
                        <nav className="flex items-center gap-6">
                            <Link
                                href="/booking"
                                className="text-sm font-medium text-white/80 transition hover:text-white"
                            >
                                Hotels
                            </Link>
                            <Link
                                href="/booking"
                                className="text-sm font-medium text-white/80 transition hover:text-white"
                            >
                                Car Rental
                            </Link>
                            <Link
                                href="/"
                                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
                            >
                                Home
                            </Link>
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
                        <p className="text-sm text-gray-500">&copy; EuroStay</p>
                        <p className="text-sm text-gray-400">
                            Powered by IdentID
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
