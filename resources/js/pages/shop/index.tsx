import { Head, Link } from '@inertiajs/react';
import { useState, createContext, useContext } from 'react';
import ShopLayout from '@/components/layouts/ShopLayout';
import { products, categories } from '@/lib/mock-data/shop';
import type { CartItem, Product } from '@/types/shop';

// Simple cart context for the shop demo
const CartContext = createContext<{
    items: CartItem[];
    addItem: (product: Product) => void;
    totalCount: number;
}>({
    items: [],
    addItem: () => {},
    totalCount: 0,
});

export function useCart() {
    return useContext(CartContext);
}

export default function ShopIndex() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [addedId, setAddedId] = useState<string | null>(null);

    const filteredProducts =
        activeCategory === 'All'
            ? products
            : products.filter((p) => p.category === activeCategory);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find(
                (item) => item.product.id === product.id,
            );
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const hasAgeRestricted = cart.some((item) => item.product.isAgeRestricted);
    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );

    return (
        <ShopLayout cartCount={cartCount}>
            <Head title="EuroMarket - European Gourmet Shop" />

            {/* Hero */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        European Gourmet Selection
                    </h1>
                    <p className="mt-2 text-lg text-emerald-100">
                        Premium food, wine & spirits from across Europe
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Sidebar - Categories + Cart */}
                    <div className="lg:col-span-1">
                        {/* Categories */}
                        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                            <h3 className="mb-3 font-semibold text-gray-900">
                                Categories
                            </h3>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                                            activeCategory === cat
                                                ? 'bg-emerald-50 font-medium text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mini Cart */}
                        {cart.length > 0 && (
                            <div className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                                <h3 className="mb-3 font-semibold text-gray-900">
                                    Cart ({cartCount})
                                </h3>
                                <div className="space-y-2">
                                    {cart.map((item) => (
                                        <div
                                            key={item.product.id}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="truncate text-gray-600">
                                                {item.quantity}&times;{' '}
                                                {item.product.name}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                &euro;
                                                {(
                                                    item.product.price *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex justify-between border-t border-gray-100 pt-3">
                                    <span className="font-semibold text-gray-900">
                                        Total
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        &euro;{cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                {hasAgeRestricted && (
                                    <div className="mt-2 flex items-center gap-1 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                                        <svg
                                            className="h-3.5 w-3.5 shrink-0"
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
                                        Age verification (18+) required at
                                        checkout
                                    </div>
                                )}
                                <Link
                                    href={`/shop/checkout?cart=${encodeURIComponent(JSON.stringify(cart.map((i) => ({ id: i.product.id, qty: i.quantity }))))}`}
                                    className="mt-3 block w-full rounded-lg bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    Checkout
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {product.isAgeRestricted && (
                                            <span className="absolute top-2 right-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <span className="text-xs font-medium text-gray-400">
                                            {product.category}
                                        </span>
                                        <Link
                                            href={`/shop/products/${product.id}`}
                                        >
                                            <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-emerald-600">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                            {product.description}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-lg font-bold text-gray-900">
                                                &euro;{product.price.toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                                    addedId === product.id
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                }`}
                                            >
                                                {addedId === product.id
                                                    ? 'Added!'
                                                    : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
