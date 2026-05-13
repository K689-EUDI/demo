import type { Product } from '@/types/shop';

export const products: Product[] = [
    {
        id: '1',
        name: 'Château Margaux 2018',
        description:
            'Premium Bordeaux red wine from one of the most prestigious estates in France. Rich, full-bodied with notes of blackcurrant and cedar.',
        price: 89.99,
        image: 'https://loremflickr.com/900/900/vineyard,grapes?lock=301',
        category: 'Wine & Spirits',
        isAgeRestricted: true,
        badge: '18+',
    },
    {
        id: '2',
        name: 'Belgian Craft Beer Selection',
        description:
            'Assorted pack of 12 premium Belgian craft beers including Trappist ales, wheat beers, and golden ales.',
        price: 34.99,
        image: 'https://loremflickr.com/900/900/hops,brewery?lock=302',
        category: 'Wine & Spirits',
        isAgeRestricted: true,
        badge: '18+',
    },
    {
        id: '3',
        name: 'Organic Extra Virgin Olive Oil',
        description:
            'Cold-pressed organic olive oil from Tuscany. Perfect for salads, cooking, and dipping. 750ml bottle.',
        price: 18.5,
        image: 'https://loremflickr.com/900/900/olive-oil,bottle?lock=303',
        category: 'Food & Gourmet',
        isAgeRestricted: false,
    },
    {
        id: '4',
        name: 'Single Malt Scotch Whisky 18yr',
        description:
            'Aged 18 years in oak casks, this Speyside single malt offers complex flavors of honey, vanilla, and dried fruits.',
        price: 124.99,
        image: 'https://loremflickr.com/900/900/oak-barrel,distillery?lock=304',
        category: 'Wine & Spirits',
        isAgeRestricted: true,
        badge: '18+',
    },
    {
        id: '5',
        name: 'Artisan Cheese Collection',
        description:
            'Curated selection of 5 European artisan cheeses: Brie, Gouda, Manchego, Roquefort, and Parmigiano-Reggiano.',
        price: 42.0,
        image: 'https://loremflickr.com/900/900/cheese,board?lock=305',
        category: 'Food & Gourmet',
        isAgeRestricted: false,
    },
    {
        id: '6',
        name: 'Premium Cigar Sampler',
        description:
            'Hand-rolled cigars from the Dominican Republic. Box of 10 assorted premium cigars in various sizes.',
        price: 79.99,
        image: 'https://loremflickr.com/900/900/cedar-box,luxury-packaging?lock=306',
        category: 'Tobacco',
        isAgeRestricted: true,
        badge: '18+',
    },
    {
        id: '7',
        name: 'Italian Espresso Machine',
        description:
            'Professional-grade espresso machine with 15-bar pump pressure, steam wand, and stainless steel construction.',
        price: 299.0,
        image: 'https://loremflickr.com/900/900/espresso-machine,coffee?lock=307',
        category: 'Appliances',
        isAgeRestricted: false,
    },
    {
        id: '8',
        name: 'Prosecco DOC Gift Set',
        description:
            'Elegant gift set with two bottles of premium Prosecco DOC and a pair of crystal champagne flutes.',
        price: 49.99,
        image: 'https://loremflickr.com/900/900/gift-box,celebration?lock=308',
        category: 'Wine & Spirits',
        isAgeRestricted: true,
        badge: '18+',
    },
    {
        id: '9',
        name: 'Gourmet Coffee Bean Selection',
        description:
            'Three 250g bags of specialty single-origin coffee beans from Ethiopia, Colombia, and Guatemala.',
        price: 36.0,
        image: 'https://loremflickr.com/900/900/coffee-beans,bag?lock=309',
        category: 'Food & Gourmet',
        isAgeRestricted: false,
    },
    {
        id: '10',
        name: 'European Chocolate Box',
        description:
            'Luxury assortment of 36 handmade chocolates from master chocolatiers. Includes dark, milk, and white varieties.',
        price: 54.0,
        image: 'https://loremflickr.com/900/900/chocolate,box?lock=310',
        category: 'Food & Gourmet',
        isAgeRestricted: false,
    },
];

export function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
}

export const categories = [
    'All',
    'Wine & Spirits',
    'Food & Gourmet',
    'Tobacco',
    'Appliances',
];
