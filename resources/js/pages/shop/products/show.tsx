import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ShopLayout from '@/components/layouts/ShopLayout';
import VerificationModal from '@/components/verification/VerificationModal';
import { getProductById } from '@/lib/mock-data/shop';

export default function ProductShow({ productId }: { productId: string }) {
    const product = getProductById(productId);
    const [quantity, setQuantity] = useState(1);
    const [showVerification, setShowVerification] = useState(false);
    const [added, setAdded] = useState(false);

    if (!product) {
        return (
            <ShopLayout>
                <Head title="Product Not Found" />
                <div className="py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Product not found
                    </h1>
                    <Link
                        href="/shop"
                        className="mt-4 inline-block text-emerald-600 hover:underline"
                    >
                        Back to shop
                    </Link>
                </div>
            </ShopLayout>
        );
    }

    const handleAddToCart = () => {
        if (product.isAgeRestricted) {
            setShowVerification(true);
        } else {
            doAdd();
        }
    };

    const doAdd = () => {
        setAdded(true);
        setTimeout(() => {
            router.visit(
                `/shop/checkout?cart=${encodeURIComponent(JSON.stringify([{ id: product.id, qty: quantity }]))}`,
            );
        }, 1000);
    };

    return (
        <ShopLayout>
            <Head title={`${product.name} - EuroMarket`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-500">
                    <Link href="/shop" className="hover:text-emerald-600">
                        Shop
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{product.name}</span>
                </nav>

                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                        {product.isAgeRestricted && (
                            <span className="absolute top-4 right-4 rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white">
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {/* Product Details */}
                    <div>
                        <span className="text-sm font-medium text-gray-400">
                            {product.category}
                        </span>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            {product.description}
                        </p>

                        <p className="mt-6 text-4xl font-bold text-gray-900">
                            &euro;{product.price.toFixed(2)}
                        </p>

                        {/* Quantity */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <div className="mt-2 flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center text-xl font-bold text-gray-900">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Age Restriction Notice */}
                        {product.isAgeRestricted && (
                            <div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
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
                                <div>
                                    <strong>Age-restricted product.</strong> You
                                    must be 18 or older to purchase this item.
                                    Age verification via your EUDI Wallet will
                                    be required.
                                </div>
                            </div>
                        )}

                        {/* Add to Cart / Buy */}
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 rounded-xl py-4 text-lg font-semibold shadow-lg transition ${
                                    added
                                        ? 'bg-green-600 text-white'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                            >
                                {added
                                    ? 'Added to Cart!'
                                    : product.isAgeRestricted
                                      ? 'Buy Now (18+ Verification)'
                                      : 'Buy Now'}
                            </button>
                        </div>

                        <Link
                            href="/shop"
                            className="mt-4 inline-block text-sm text-gray-500 hover:text-emerald-600"
                        >
                            &larr; Continue shopping
                        </Link>
                    </div>
                </div>
            </div>

            <VerificationModal
                open={showVerification}
                type="age"
                title="Age Verification Required"
                description="Verify you are 18 or older using your EUDI Wallet. Only your age_over_18 status is requested."
                onVerified={() => {
                    setShowVerification(false);
                    doAdd();
                }}
                onClose={() => setShowVerification(false)}
            />
        </ShopLayout>
    );
}
