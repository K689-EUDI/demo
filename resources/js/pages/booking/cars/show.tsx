import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import BookingLayout from '@/components/layouts/BookingLayout';
import VerificationModal from '@/components/verification/VerificationModal';
import { extractVerificationAttributes } from '@/lib/verification';
import { getCarById } from '@/lib/mock-data/booking';

export default function CarShow({ carId }: { carId: string }) {
    const car = getCarById(carId);
    const [showVerification, setShowVerification] = useState(false);
    const [days, setDays] = useState(3);

    if (!car) {
        return (
            <BookingLayout>
                <Head title="Car Not Found" />
                <div className="py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Car not found
                    </h1>
                    <Link
                        href="/booking"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        Back to cars
                    </Link>
                </div>
            </BookingLayout>
        );
    }

    const totalPrice = car.pricePerDay * days;

    return (
        <BookingLayout>
            <Head title={`${car.make} ${car.model} - EuroStay Car Rental`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-500">
                    <Link href="/booking" className="hover:text-[#003580]">
                        Car Rental
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">
                        {car.make} {car.model}
                    </span>
                </nav>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Car Details */}
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                            <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                                <img
                                    src={car.image}
                                    alt={`${car.make} ${car.model}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6 sm:p-8">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                            {car.type}
                                        </span>
                                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                                            {car.make} {car.model}
                                        </h1>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-gray-900">
                                            &euro;{car.pricePerDay}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            per day
                                        </p>
                                    </div>
                                </div>

                                {/* Specs */}
                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {car.seats}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Seats
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                                        <p className="text-lg font-bold text-gray-900">
                                            {car.transmission}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Transmission
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                                        <p className="text-lg font-bold text-gray-900">
                                            {car.fuelType}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Fuel
                                        </p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mt-6">
                                    <h3 className="mb-3 font-semibold text-gray-900">
                                        Features
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {car.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm text-green-700"
                                            >
                                                <svg
                                                    className="h-3.5 w-3.5"
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
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">
                                Rental Summary
                            </h2>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Rental Duration
                                </label>
                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setDays(Math.max(1, days - 1))
                                        }
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                    >
                                        -
                                    </button>
                                    <span className="w-16 text-center text-xl font-bold text-gray-900">
                                        {days}
                                    </span>
                                    <button
                                        onClick={() => setDays(days + 1)}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        days
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        &euro;{car.pricePerDay} &times; {days}{' '}
                                        days
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        &euro;{totalPrice}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Insurance
                                    </span>
                                    <span className="font-medium text-green-600">
                                        Included
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                                <span className="text-lg font-bold text-gray-900">
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-gray-900">
                                    &euro;{totalPrice}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowVerification(true)}
                                className="mt-6 w-full rounded-xl bg-[#003580] py-3.5 text-lg font-semibold text-white shadow-lg transition hover:bg-[#00264d]"
                            >
                                Rent This Car
                            </button>

                            {/* License notice */}
                            <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                                <svg
                                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
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
                                <p>
                                    <strong>Driving licence required.</strong>{' '}
                                    You&apos;ll need to verify your driving
                                    licence via your EU Digital Identity Wallet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <VerificationModal
                open={showVerification}
                type="mdl"
                title="Verify Driving Licence"
                description="Scan with your EU Digital Identity Wallet to verify your driving licence for this car rental."
                onVerified={(status) => {
                    const verification = extractVerificationAttributes(status);

                    setShowVerification(false);
                    router.visit('/booking/confirmation', {
                        data: {
                            type: 'car',
                            name: `${car.make} ${car.model}`,
                            days,
                            verification: JSON.stringify(verification),
                        },
                    });
                }}
                onClose={() => setShowVerification(false)}
            />
        </BookingLayout>
    );
}
