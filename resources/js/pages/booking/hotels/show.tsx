import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import BookingLayout from '@/components/layouts/BookingLayout';
import VerificationModal from '@/components/verification/VerificationModal';
import { extractVerificationAttributes } from '@/lib/verification';
import { getHotelById, cars } from '@/lib/mock-data/booking';

export default function HotelShow({ hotelId }: { hotelId: string }) {
    const hotel = getHotelById(hotelId);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<string | null>(null);
    const [showVerification, setShowVerification] = useState(false);

    if (!hotel) {
        return (
            <BookingLayout>
                <Head title="Hotel Not Found" />
                <div className="py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hotel not found
                    </h1>
                    <Link
                        href="/booking"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        Back to hotels
                    </Link>
                </div>
            </BookingLayout>
        );
    }

    const room = hotel.rooms.find((r) => r.id === selectedRoom);
    const car = cars.find((c) => c.id === selectedCar);

    return (
        <BookingLayout>
            <Head title={`${hotel.name} - EuroStay`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-500">
                    <Link href="/booking" className="hover:text-[#003580]">
                        Hotels
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{hotel.name}</span>
                </nav>

                {/* Hotel Header */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                    <div className="aspect-[21/9] overflow-hidden">
                        <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {hotel.name}
                                </h1>
                                <p className="mt-1 text-lg text-gray-500">
                                    {hotel.location}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        {hotel.reviewCount} reviews
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003580] text-sm font-bold text-white">
                                    {hotel.rating}
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-gray-600">
                            {hotel.description}
                        </p>

                        {/* Amenities */}
                        <div className="mt-6">
                            <h3 className="mb-3 font-semibold text-gray-900">
                                Amenities
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {hotel.amenities.map((amenity) => (
                                    <span
                                        key={amenity}
                                        className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Room Selection */}
                <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">
                        Choose Your Room
                    </h2>
                    <div className="space-y-4">
                        {hotel.rooms.map((r) => (
                            <div
                                key={r.id}
                                className={`cursor-pointer rounded-xl border-2 bg-white p-5 transition-all ${
                                    selectedRoom === r.id
                                        ? 'border-[#003580] shadow-md'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedRoom(r.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {r.name}
                                        </h3>
                                        <div className="mt-1 flex gap-4 text-sm text-gray-500">
                                            <span>{r.bedType} bed</span>
                                            <span>
                                                Up to {r.maxGuests} guests
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900">
                                            &euro;{r.pricePerNight}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            per night
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reserve Button */}
                <div className="mt-8 flex items-center justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div>
                        {room ? (
                            <>
                                <p className="text-sm text-gray-500">
                                    Selected: {room.name}
                                    {car ? ` + ${car.make} ${car.model}` : ''}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    &euro;{room.pricePerNight}
                                    <span className="text-sm font-normal text-gray-500">
                                        {' '}
                                        /night
                                    </span>
                                    {car && (
                                        <span className="text-sm font-normal text-gray-500">
                                            {' '}
                                            + &euro;{car.pricePerDay}/day car
                                            rental
                                        </span>
                                    )}
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-500">
                                Select a room to continue
                            </p>
                        )}
                    </div>
                    <button
                        disabled={!selectedRoom}
                        onClick={() => setShowVerification(true)}
                        className="rounded-xl bg-[#003580] px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-[#00264d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reserve Now
                    </button>
                </div>

                {/* ID verification notice */}
                <div className="mt-4 flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
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
                        <strong>Identity verification required.</strong> To
                        complete your reservation, you will need to verify your
                        identity using your EU Digital Identity Wallet.
                        {car && (
                            <>
                                {' '}
                                A driving licence is also required for the car
                                rental.
                            </>
                        )}
                    </p>
                </div>

                {/* Optional Car Rental */}
                <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">
                        Add a Car Rental{' '}
                        <span className="text-sm font-normal text-gray-400">
                            (optional)
                        </span>
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {cars.map((c) => (
                            <div
                                key={c.id}
                                className={`cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-all ${
                                    selectedCar === c.id
                                        ? 'border-[#003580] shadow-md'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() =>
                                    setSelectedCar(
                                        selectedCar === c.id ? null : c.id,
                                    )
                                }
                            >
                                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                                    <img
                                        src={c.image}
                                        alt={`${c.make} ${c.model}`}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-900">
                                        {c.make} {c.model}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {c.type} &middot; {c.seats} seats
                                        &middot; {c.transmission}
                                    </p>
                                    <p className="mt-2 font-bold text-gray-900">
                                        &euro;{c.pricePerDay}
                                        <span className="text-sm font-normal text-gray-500">
                                            {' '}
                                            /day
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedCar && (
                        <button
                            onClick={() => setSelectedCar(null)}
                            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                        >
                            Remove car rental
                        </button>
                    )}
                </div>
            </div>

            <VerificationModal
                open={showVerification}
                type={car ? 'pid_mdl' : 'pid'}
                title="Verify Your Identity"
                description={
                    car
                        ? 'Scan with your EU Digital Identity Wallet to verify your identity and driving licence.'
                        : 'Scan with your EU Digital Identity Wallet to verify your identity for this reservation.'
                }
                onVerified={(status) => {
                    const verification = extractVerificationAttributes(status);

                    setShowVerification(false);
                    router.visit('/booking/confirmation', {
                        data: {
                            type: car ? 'hotel_car' : 'hotel',
                            name: hotel.name,
                            room: room?.name,
                            car: car ? `${car.make} ${car.model}` : undefined,
                            verification: JSON.stringify(verification),
                        },
                    });
                }}
                onClose={() => setShowVerification(false)}
            />
        </BookingLayout>
    );
}
