
import React from "react";
import CollectionPage from "./CollectionPage";

const heroImage =
  "https://i.pinimg.com/1200x/ec/f9/ed/ecf9ed9d8194b1239237df36371e6248.jpg";

const config = {
  brandName: "DUROTAN",
  heroEyebrow: "Women's Collection",
  heroTitle: "New In Items",
  heroSubtitle:
    "The collection with the essential pieces for every woman. Effortless style is the best choice for any occasion. Check it out!",
  heroImage,
  accent: "#B89A6A",

  categories: [
    { label: "New In" },
    { label: "Best Seller" },
    { label: "Sale", active: true },
    { label: "Dresses" },
    { label: "Coats" },
    { label: "Knitwear" },
    { label: "Blouses & Shirts" },
    { label: "Skirts" },
    { label: "Trousers" },
    { label: "Accessories" },
  ],

  materials: [
    { label: "Cotton" },
    { label: "Silk" },
    { label: "Wool" },
    { label: "Leather", checked: true },
  ],

  colors: [
    { label: "Black", hex: "#000000", checked: true },
    { label: "White", hex: "#ffffff" },
    { label: "Blush", hex: "#d8a7a0" },
    { label: "Olive", hex: "#7c7a52" },
  ],

  sizes: ["XS", "S", "M", "L", "XL"],

  priceRange: { min: 79, max: 449 },

  products: [
    {
      badge: "Online Exclusive",
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop",
      name: "Wool blend belted coat",
      price: 128.0,
      salePrice: 96.0,
    },
    {
      badge: "New Now",
      badgeDark: true,
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
      name: "Satin slip midi dress",
      price: 89.99,
      colorDots: ["#1c1a17", "#d8a7a0", "#7c7a52"],
    },
    {
      badge: "6 Colours",
      image:
        "https://images.unsplash.com/photo-1551489186-cf8726f514f8?q=80&w=600&auto=format&fit=crop",
      name: "Ribbed knit turtleneck sweater",
      price: 64.5,
      salePrice: 45.5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop",
      name: "Structured leather tote bag",
      price: 98.0,
    },
    {
      badge: "Washable",
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600&auto=format&fit=crop",
      name: "Tailored wide-leg trousers",
      price: 74.99,
      thumbs: [
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=100&auto=format&fit=crop",
      ],
    },
    {
      badge: "Online Exclusive",
      image:
        "https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=600&auto=format&fit=crop",
      name: "Double-breasted wool tailored blazer",
      price: 112.0,
    },
    {
      badge: "New Now",
      badgeDark: true,
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
      name: "Suede ankle boots",
      price: 95.5,
      miniSizes: [{ label: "37" }, { label: "38", sel: true }, { label: "39" }],
    },
    {
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
      name: "Silk button-down blouse",
      price: 69.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop",
      name: "Cashmere blend scarf",
      price: 38.5,
      salePrice: 26.59,
      colourCount: 4,
    },
    {
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
      name: "A-line pleated midi skirt",
      price: 64.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
      name: "Gold-tone layered necklace set",
      price: 24.69,
    },
    {
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop",
      name: "Oversized round sunglasses",
      price: 54.9,
    },
  ],

  recentlyViewed: [
    {
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=400&auto=format&fit=crop",
      name: "Wool blend belted coat",
      price: 128.0,
      salePrice: 96.0,
    },
    {
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400&auto=format&fit=crop",
      name: "Suede ankle boots",
      price: 95.5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=400&auto=format&fit=crop",
      name: "Cashmere blend scarf",
      price: 38.5,
      salePrice: 26.59,
    },
    {
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400&auto=format&fit=crop",
      name: "Silk button-down blouse",
      price: 69.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=400&auto=format&fit=crop",
      name: "Satin slip midi dress",
      price: 89.99,
    },
  ],
};

export function Womens() {
  return <CollectionPage config={config} />;
}