import Navbar from "../components/Navbar";

   import React from "react";
import CollectionPage from "./CollectionPage";

const heroImage =
  "https://i.pinimg.com/1200x/af/b2/58/afb258200c24d0258a86f9ec0d4611b1.jpg";

const config = {
  brandName: "DUROTAN",
  heroEyebrow: "Men's Collection",
  heroTitle: "New In Items",
  heroSubtitle:
    "The collection with the essential items for a gentlemen. Simple alway is the best choice for your any style. Check it out!",
  heroImage,
  accent: "#B89A6A",

  categories: [
    { label: "New In" },
    { label: "Best Seller" },
    { label: "Sale", active: true },
    { label: "Coats" },
    { label: "Jackets" },
    { label: "Cardigans & Sweaters" },
    { label: "Blazers" },
    { label: "Sweatshirts" },
    { label: "Shirts" },
    { label: "T-Shirts" },
  ],

  materials: [
    { label: "Cotton" },
    { label: "Down" },
    { label: "Houndstooth" },
    { label: "Leather", checked: true },
  ],

  colors: [
    { label: "Black", hex: "#000000", checked: true },
    { label: "White", hex: "#ffffff" },
    { label: "Red", hex: "#b3322a" },
    { label: "Orange", hex: "#c97a3d" },
  ],

  sizes: ["XS", "S", "M", "L"],

  priceRange: { min: 99, max: 499 },

  products: [
    {
      badge: "Online Exclusive",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
      name: "Embossed leather, wool & cashmere gloves",
      price: 68.5,
      salePrice: 49.5,
    },
    {
      badge: "Washable",
      image:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=600&auto=format&fit=crop",
      name: "Simple text for name product",
      price: 69.99,
      colorDots: ["#1c1a17", "#7a6a55", "#c9bfa8", "#b3322a"],
    },
    {
      badge: "6 Colours",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
      name: "Leather maxi trainers",
      price: 68.5,
      salePrice: 49.5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop",
      name: "Pebbled crossbody belt bag",
      price: 72.99,
    },
    {
      badge: "Easy Iron",
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop",
      name: "Slim fit modal cotton shirt",
      price: 59.99,
      thumbs: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=100&auto=format&fit=crop",
      ],
    },
    {
      badge: "Online Exclusive",
      image:
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600&auto=format&fit=crop",
      name: "Double-breasted wool Tailored coat",
      price: 56.99,
    },
    {
      badge: "New Now",
      badgeDark: true,
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
      name: "Suede sport shoes",
      price: 45.5,
      miniSizes: [{ label: "39" }, { label: "40", sel: true }, { label: "41" }],
    },
    {
      image:
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop",
      name: "Slim fit modal cotton shirt",
      price: 59.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=600&auto=format&fit=crop",
      name: "Contrast scarf",
      price: 28.5,
      salePrice: 19.59,
      colourCount: 3,
    },
    {
      image:
        "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=600&auto=format&fit=crop",
      name: "Regular fit striped cotton shirt",
      price: 79.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=600&auto=format&fit=crop",
      name: "Combo x 3 socks Poll&Boar",
      price: 15.69,
    },
    {
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop",
      name: "Panther houndstooth round sunglass",
      price: 59.9,
    },
  ],

  recentlyViewed: [
    {
      image:
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=400&auto=format&fit=crop",
      name: "Double-breasted wool Tailored coat",
      price: 56.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=400&auto=format&fit=crop",
      name: "Suede sport shoes",
      price: 45.5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=400&auto=format&fit=crop",
      name: "Contrast scarf",
      price: 28.5,
      salePrice: 19.59,
    },
    {
      image:
        "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=400&auto=format&fit=crop",
      name: "Regular fit striped cotton shirt",
      price: 79.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=400&auto=format&fit=crop",
      name: "Simple text for name product",
      price: 69.99,
    },
  ],
};

export function Mens() {
  return <CollectionPage config={config} />;
}

