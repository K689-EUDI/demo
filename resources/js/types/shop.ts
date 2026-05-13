export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isAgeRestricted: boolean;
    badge?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
