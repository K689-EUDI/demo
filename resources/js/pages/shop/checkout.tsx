import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import ShopLayout from '@/components/layouts/ShopLayout';
import VerificationModal from '@/components/verification/VerificationModal';
import { getProductById } from '@/lib/mock-data/shop';

interface CartEntry {
    id: string;
    qty: number;
}

export default function ShopCheckout() {
    const [showVerification, setShowVerification] = useState(false);
    const [ageVerified, setAgeVerified] = useState(false);

    // Parse cart from URL query params
    const cartEntries = useMemo<CartEntry[]>(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const cartParam = params.get('cart');
            if (cartParam) {
                return JSON.parse(decodeURIComponent(cartParam));
            }
        } catch {
            // Ignore parse errors
        }
        return [];
    }, []);

    const cartItems = useMemo(
        () =>
            cartEntries
                .map((entry) => {
                    const product = getProductById(entry.id);
                    return product ? { product, quantity: entry.qty } : null;
                })
                .filter(Boolean) as {
                product: NonNullable<ReturnType<typeof getProductById>>;
                quantity: number;
            }[],
        [cartEntries],
    );

    const hasAgeRestricted = cartItems.some(
        (item) => item.product.isAgeRestricted,
    );
    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const canPlaceOrder = !hasAgeRestricted || ageVerified;

    return (
        <ShopLayout>
            <Head title="Checkout - EuroMarket" />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

                {cartItems.length === 0 ? (
                    <div className="mt-10 text-center">
                        <p className="text-lg text-gray-500">
                            Your cart is empty.
                        </p>
                        <Link
                            href="/shop"
                            className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="mt-8 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200"
                                >
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="h-20 w-20 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                        {item.product.isAgeRestricted && (
                                            <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                                18+ Required
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">
                                        &euro;
                                        {(
                                            item.product.price * item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-6 flex justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <span className="text-xl font-bold text-gray-900">
                                Total
                            </span>
                            <span className="text-2xl font-bold text-gray-900">
                                &euro;{total.toFixed(2)}
                            </span>
                        </div>

                        {/* Age Verification */}
                        {hasAgeRestricted && (
                            <div className="mt-6">
                                {!ageVerified ? (
                                    <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-200">
                                                <svg
                                                    className="h-6 w-6 text-amber-700"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-amber-900">
                                                    Age Verification Required
                                                </h3>
                                                <p className="mt-1 text-sm text-amber-700">
                                                    Your cart contains
                                                    age-restricted items. Please
                                                    verify you are 18 or older
                                                    using your EU Digital
                                                    Identity Wallet.
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        setShowVerification(
                                                            true,
                                                        )
                                                    }
                                                    className="mt-4 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-amber-700"
                                                >
                                                    Verify Age (18+)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-700 ring-1 ring-green-200">
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                            />
                                        </svg>
                                        <span className="font-medium">
                                            Age verified (18+) via EU Digital
                                            Identity Wallet
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Place Order */}
                        <button
                            disabled={!canPlaceOrder}
                            onClick={() =>
                                router.visit('/shop/confirmation', {
                                    data: {
                                        items: cartItems
                                            .map(
                                                (i) =>
                                                    `${i.quantity}× ${i.product.name}`,
                                            )
                                            .join(', '),
                                        total: total.toFixed(2),
                                    },
                                })
                            }
                            className="mt-6 w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Place Order
                        </button>

                        <Link
                            href="/shop"
                            className="mt-4 block text-center text-sm text-gray-500 hover:text-emerald-600"
                        >
                            &larr; Continue shopping
                        </Link>
                    </>
                )}
            </div>

            <VerificationModal
                open={showVerification}
                type="age"
                title="Age Verification (18+)"
                description="Verify you are 18 or older using your EU Digital Identity Wallet."
                onVerified={() => {
                    setShowVerification(false);
                    setAgeVerified(true);
                }}
                onClose={() => setShowVerification(false)}
            />
        </ShopLayout>
    );
}
