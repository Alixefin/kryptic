// Product types
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  hoverImage?: string;
  href: string;
  soldOut?: boolean;
  category: string;
}

// Placeholder image - will be replaced with actual product images
// Images should be placed in /public/images/products/
const PLACEHOLDER_IMAGE = "/images/products/placeholder.png";

export const shirtsProducts: Product[] = [
  {
    id: "shirt-1",
    name: "Classic Shirt",
    price: 25000,
    originalPrice: 32000,
    discount: 20,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/shirt-1",
    category: "shirts",
  },
  {
    id: "shirt-2",
    name: "Premium Shirt",
    price: 28000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/shirt-2",
    category: "shirts",
  },
  {
    id: "shirt-3",
    name: "Designer Shirt",
    price: 22000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/shirt-3",
    category: "shirts",
  },
  {
    id: "shirt-4",
    name: "Luxury Shirt",
    price: 35000,
    originalPrice: 45000,
    discount: 20,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/shirt-4",
    category: "shirts",
  },
];

export const bottomsProducts: Product[] = [
  {
    id: "bottom-1",
    name: "Premium Denim",
    price: 25000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/bottom-1",
    category: "bottoms",
  },
  {
    id: "bottom-2",
    name: "Classic Shorts",
    price: 14000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/bottom-2",
    category: "bottoms",
  },
  {
    id: "bottom-3",
    name: "Designer Shorts",
    price: 14000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/bottom-3",
    category: "bottoms",
  },
  {
    id: "bottom-4",
    name: "Luxury Shorts",
    price: 14000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/bottom-4",
    category: "bottoms",
  },
];

export const jacketsProducts: Product[] = [
  {
    id: "jacket-1",
    name: "Varsity Jacket",
    price: 32000,
    originalPrice: 40000,
    discount: 20,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/jacket-1",
    category: "jackets",
  },
  {
    id: "jacket-2",
    name: "Classic Jacket",
    price: 30000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/jacket-2",
    category: "jackets",
  },
  {
    id: "jacket-3",
    name: "Windbreaker",
    price: 28500,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/jacket-3",
    category: "jackets",
  },
  {
    id: "jacket-4",
    name: "Premium Jacket",
    price: 29200,
    originalPrice: 36500,
    discount: 20,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/jacket-4",
    category: "jackets",
  },
];

export const tshirtsProducts: Product[] = [
  {
    id: "tshirt-1",
    name: "Classic Tee",
    price: 15000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/tshirt-1",
    category: "t-shirts",
  },
  {
    id: "tshirt-2",
    name: "Premium Tee",
    price: 18000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/tshirt-2",
    category: "t-shirts",
  },
  {
    id: "tshirt-3",
    name: "Designer Tee",
    price: 12000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/tshirt-3",
    category: "t-shirts",
  },
  {
    id: "tshirt-4",
    name: "Luxury Tee",
    price: 22000,
    originalPrice: 27500,
    discount: 20,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/tshirt-4",
    category: "t-shirts",
  },
];

export const accessoriesProducts: Product[] = [
  {
    id: "accessory-1",
    name: "Premium Hat",
    price: 8000,
    soldOut: true,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/accessory-1",
    category: "accessories",
  },
  {
    id: "accessory-2",
    name: "Designer Socks",
    price: 3500,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/accessory-2",
    category: "accessories",
  },
  {
    id: "accessory-3",
    name: "Classic Cap",
    price: 8500,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/accessory-3",
    category: "accessories",
  },
  {
    id: "accessory-4",
    name: "Luxury Set",
    price: 35000,
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    href: "/products/accessory-4",
    category: "accessories",
  },
];

// Combined products for easy access
export const allProducts: Product[] = [
  ...shirtsProducts,
  ...bottomsProducts,
  ...jacketsProducts,
  ...tshirtsProducts,
  ...accessoriesProducts,
];
