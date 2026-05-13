import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="EuroStay & EuroMarket" />
            <div className="flex min-h-screen flex-col bg-gray-50">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
                        <span className="text-lg font-bold text-gray-900">
                            IdentID
                        </span>
                    </div>
                </header>

                {/* Main */}
                <main className="flex flex-1 items-center">
                    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* Booking Card */}
                            <Link
                                href="/booking"
                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="bg-[#003580] px-6 py-8">
                                    <svg
                                        className="h-10 w-10 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                        />
                                    </svg>
                                    <h2 className="mt-4 text-2xl font-bold text-white">
                                        EuroStay
                                    </h2>
                                    <p className="mt-1 text-blue-200">
                                        Hotels &amp; Car Rental
                                    </p>
                                </div>
                                <div className="flex items-center justify-between px-6 py-4">
                                    <span className="text-sm text-gray-500">
                                        Book hotels and rent cars across Europe
                                    </span>
                                    <svg
                                        className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </div>
                            </Link>

                            {/* Shop Card */}
                            <Link
                                href="/shop"
                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="bg-emerald-600 px-6 py-8">
                                    <svg
                                        className="h-10 w-10 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                        />
                                    </svg>
                                    <h2 className="mt-4 text-2xl font-bold text-white">
                                        EuroMarket
                                    </h2>
                                    <p className="mt-1 text-emerald-100">
                                        Gourmet Shop
                                    </p>
                                </div>
                                <div className="flex items-center justify-between px-6 py-4">
                                    <span className="text-sm text-gray-500">
                                        Wine, spirits &amp; European delicacies
                                    </span>
                                    <svg
                                        className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white">
                    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                        <p className="text-center text-sm text-gray-400">
                            Powered by IdentID
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
