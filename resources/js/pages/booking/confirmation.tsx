import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import BookingLayout from '@/components/layouts/BookingLayout';

interface VerificationAttribute {
    key: string;
    value: string;
}

interface BookingConfirmationProps {
    type: string;
    name: string;
    room: string;
    car: string;
    days: number;
    verification: VerificationAttribute[];
}

export default function BookingConfirmation() {
    const { type, name, room, car, days, verification } =
        usePage<BookingConfirmationProps>().props;

    const confirmationNumber = useMemo(
        () => 'EU-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        [],
    );

    const isCarOnly = type === 'car';
    const hasCar = type === 'hotel_car' || isCarOnly;

    return (
        <BookingLayout>
            <Head title="Booking Confirmed - EuroStay" />

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
                        Booking Confirmed!
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Your identity has been verified and your booking is
                        confirmed.
                    </p>

                    {/* Verification Badge */}
                    <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2.5 text-sm font-medium text-blue-700">
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
                        Identity Verified
                    </div>

                    {/* Details Card */}
                    <div className="mt-8 rounded-xl bg-gray-50 p-6 text-left">
                        <h3 className="font-semibold text-gray-900">
                            Booking Details
                        </h3>
                        <dl className="mt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <dt className="text-gray-500">
                                    Confirmation Number
                                </dt>
                                <dd className="font-mono font-medium text-gray-900">
                                    {confirmationNumber}
                                </dd>
                            </div>
                            <div className="flex justify-between text-sm">
                                <dt className="text-gray-500">Status</dt>
                                <dd className="font-medium text-green-600">
                                    Confirmed
                                </dd>
                            </div>
                            {name && (
                                <div className="flex justify-between text-sm">
                                    <dt className="text-gray-500">
                                        {isCarOnly ? 'Vehicle' : 'Hotel'}
                                    </dt>
                                    <dd className="font-medium text-gray-900">
                                        {name}
                                    </dd>
                                </div>
                            )}
                            {room && (
                                <div className="flex justify-between text-sm">
                                    <dt className="text-gray-500">Room</dt>
                                    <dd className="font-medium text-gray-900">
                                        {room}
                                    </dd>
                                </div>
                            )}
                            {hasCar && car && (
                                <div className="flex justify-between text-sm">
                                    <dt className="text-gray-500">
                                        Car Rental
                                    </dt>
                                    <dd className="font-medium text-gray-900">
                                        {car}
                                    </dd>
                                </div>
                            )}
                            {isCarOnly && days > 0 && (
                                <div className="flex justify-between text-sm">
                                    <dt className="text-gray-500">Duration</dt>
                                    <dd className="font-medium text-gray-900">
                                        {days} {days === 1 ? 'day' : 'days'}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {verification.length > 0 && (
                        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-6 text-left">
                            <h3 className="font-semibold text-gray-900">
                                Verified Details
                            </h3>
                            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                                {verification.map((attribute) => (
                                    <div
                                        key={`${attribute.key}-${attribute.value}`}
                                        className="rounded-lg bg-white p-4 ring-1 ring-blue-100"
                                    >
                                        <dt className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">
                                            {attribute.key}
                                        </dt>
                                        <dd className="mt-2 text-sm font-medium text-gray-900">
                                            {attribute.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/booking"
                            className="rounded-xl bg-[#003580] px-8 py-3 font-semibold text-white shadow transition hover:bg-[#00264d]"
                        >
                            Browse More
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
        </BookingLayout>
    );
}
