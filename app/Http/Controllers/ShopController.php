<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('shop/index');
    }

    public function productDetail(string $id): Response
    {
        return Inertia::render('shop/products/show', [
            'productId' => $id,
        ]);
    }

    public function checkout(): Response
    {
        return Inertia::render('shop/checkout');
    }

    public function confirmation(Request $request): Response
    {
        return Inertia::render('shop/confirmation', [
            'items' => $request->string('items', ''),
            'total' => $request->string('total', ''),
        ]);
    }
}
