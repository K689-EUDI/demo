<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('booking/index');
    }

    public function hotelDetail(string $id): Response
    {
        return Inertia::render('booking/hotels/show', [
            'hotelId' => $id,
        ]);
    }

    public function carDetail(string $id): Response
    {
        return Inertia::render('booking/cars/show', [
            'carId' => $id,
        ]);
    }

    public function confirmation(Request $request): Response
    {
        $verification = json_decode($request->string('verification', '[]')->toString(), true);

        return Inertia::render('booking/confirmation', [
            'type' => $request->string('type', 'hotel'),
            'name' => $request->string('name', ''),
            'room' => $request->string('room', ''),
            'car' => $request->string('car', ''),
            'days' => $request->integer('days', 3),
            'verification' => collect(is_array($verification) ? $verification : [])
                ->filter(fn ($item) => is_array($item))
                ->map(fn (array $item) => [
                    'key' => (string) ($item['key'] ?? ''),
                    'value' => (string) ($item['value'] ?? ''),
                ])
                ->filter(fn (array $item) => $item['key'] !== '' && $item['value'] !== '')
                ->values()
                ->all(),
        ]);
    }
}
