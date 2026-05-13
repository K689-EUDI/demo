import { Head, Link } from '@inertiajs/react';
import BookingLayout from '@/components/layouts/BookingLayout';
import { hotels, cars } from '@/lib/mock-data/booking';

export default function BookingIndex() {
    return (
        <BookingLayout>
            <Head title="EuroStay - Hotels & Car Rental" />

            {/* Hero Banner */}
            <div className="bg-[#003580] pt-8 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        Find your next stay
                    </h1>
                    <p className="mt-2 text-lg text-blue-200">
                        Search deals on hotels and car rentals across Europe
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Hotels Section */}
                <section>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Popular Hotels
                        </h2>
                        <span className="text-sm text-gray-500">
                            {hotels.length} properties
                        </span>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {hotels.map((hotel) => (
                            <Link
                                key={hotel.id}
                                href={`/booking/hotels/${hotel.id}`}
                                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-[#003580]">
                                                {hotel.name}
                                            </h3>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                {hotel.location}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-md bg-[#003580] px-2 py-1 text-xs font-bold text-white">
                                            <span>{hotel.rating}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {hotel.amenities
                                            .slice(0, 3)
                                            .map((amenity) => (
                                                <span
                                                    key={amenity}
                                                    className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                    </div>
                                    <div className="mt-3 flex items-end justify-between border-t border-gray-100 pt-3">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Starting from
                                            </p>
                                            <p className="text-lg font-bold text-gray-900">
                                                &euro;{hotel.pricePerNight}
                                                <span className="text-sm font-normal text-gray-500">
                                                    {' '}
                                                    /night
                                                </span>
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {hotel.reviewCount} reviews
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Car Rental Section */}
                <section className="mt-16">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Car Rental
                        </h2>
                        <span className="text-sm text-gray-500">
                            {cars.length} vehicles
                        </span>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {cars.map((car) => (
                            <Link
                                key={car.id}
                                href={`/booking/cars/${car.id}`}
                                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                                    <img
                                        src={car.image}
                                        alt={`${car.make} ${car.model}`}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#003580]">
                                        {car.make} {car.model}
                                    </h3>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        {car.type}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
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
                                                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                                />
                                            </svg>
                                            {car.seats} seats
                                        </span>
                                        <span>{car.transmission}</span>
                                        <span>{car.fuelType}</span>
                                    </div>
                                    <div className="mt-3 border-t border-gray-100 pt-3">
                                        <p className="text-lg font-bold text-gray-900">
                                            &euro;{car.pricePerDay}
                                            <span className="text-sm font-normal text-gray-500">
                                                {' '}
                                                /day
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Info Banner */}
                <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                            <svg
                                className="h-8 w-8"
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
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">
                                Secure Booking with EU Digital Identity
                            </h3>
                            <p className="mt-1 text-blue-100">
                                Verify your identity quickly and securely using
                                your EU Digital Identity Wallet when making a
                                reservation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </BookingLayout>
    );
}
