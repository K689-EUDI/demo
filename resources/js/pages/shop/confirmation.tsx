import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import ShopLayout from '@/components/layouts/ShopLayout';

interface ShopConfirmationProps {
    items: string;
    total: string;
}

export default function ShopConfirmation() {
    const { items, total } = usePage<ShopConfirmationProps>().props;

    const orderNumber = useMemo(
        () => 'EM-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        [],
    );

    const itemList = items ? items.split(', ') : [];

    return (
        <ShopLayout>
            <Head title="Order Confirmed - EuroMarket" />

            <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200 sm:p-12">
                    {/* Success Icon */}
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <svg
                            className="h-10 w-10 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                    </div>

                    <h1 className="mt-6 text-3xl font-bold text-gray-900">
                        Order Confirmed!
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Thank you for your purchase. Your order is being
                        processed.
                    </p>

                    {/* Verification Badge */}
                    <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-700">
                        <svg
                            className="h-5 w-5"
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
                        Age Verified
                    </div>

                    {/* Order Details */}
                    <div className="mt-8 rounded-xl bg-gray-50 p-6 text-left">
                        <h3 className="font-semibold text-gray-900">
                            Order Details
                        </h3>
                        <dl className="mt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <dt className="text-gray-500">Order Number</dt>
                                <dd className="font-mono font-medium text-gray-900">
                                    {orderNumber}
                                </dd>
                            </div>
                            <div className="flex justify-between text-sm">
                                <dt className="text-gray-500">Status</dt>
                                <dd className="font-medium text-green-600">
                                    Confirmed
                                </dd>
                            </div>
                        </dl>
                        {itemList.length > 0 && (
                            <>
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-medium text-gray-700">
                                        Items
                                    </h4>
                                    <ul className="mt-2 space-y-1.5">
                                        {itemList.map((item, i) => (
                                            <li
                                                key={i}
                                                className="text-sm text-gray-600"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {total && (
                                    <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-sm">
                                        <span className="font-semibold text-gray-900">
                                            Total
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            &euro;{total}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/shop"
                            className="rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white shadow transition hover:bg-emerald-700"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/"
                            className="rounded-xl bg-gray-100 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
