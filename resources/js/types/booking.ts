export interface Hotel {
    id: string;
    name: string;
    location: string;
    country: string;
    rating: number;
    reviewCount: number;
    pricePerNight: number;
    image: string;
    description: string;
    amenities: string[];
    rooms: Room[];
}

export interface Room {
    id: string;
    name: string;
    pricePerNight: number;
    maxGuests: number;
    bedType: string;
}

export interface Car {
    id: string;
    make: string;
    model: string;
    type: string;
    pricePerDay: number;
    image: string;
    seats: number;
    transmission: string;
    fuelType: string;
    features: string[];
}
