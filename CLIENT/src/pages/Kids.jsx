import React from "react";
import CollectionPage from "./CollectionPage";

const heroImage =
  "https://i.pinimg.com/736x/2e/d8/5a/2ed85a15375e7276604816eb56e0a90d.jpg";

const config = {
  brandName: "DUROTAN",
  heroEyebrow: "Kids' Collection",
  heroTitle: "New In Items",
  heroSubtitle:
    "Comfortable, playful essentials for the little ones. Easy to wear, made to last. Check it out!",
  heroImage,
  accent: "#B89A6A",

  categories: [
    { label: "New In" },
    { label: "Best Seller" },
    { label: "Sale", active: true },
    { label: "Outerwear" },
    { label: "Tops & Tees" },
    { label: "Sweaters" },
    { label: "Bottoms" },
    { label: "Dresses" },
    { label: "Shoes" },
    { label: "Accessories" },
  ],

  materials: [
    { label: "Cotton", checked: true },
    { label: "Fleece" },
    { label: "Denim" },
    { label: "Wool" },
  ],

  colors: [
    { label: "Yellow", hex: "#e3b341" },
    { label: "Sky Blue", hex: "#8fb8d8" },
    { label: "Red", hex: "#b3322a" },
    { label: "Cream", hex: "#efe6d6", checked: true },
  ],

  sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],

  priceRange: { min: 19, max: 149 },

  products: [
    {
      badge: "Online Exclusive",
      image:
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600&auto=format&fit=crop",
      name: "Padded hooded puffer jacket",
      price: 58.5,
      salePrice: 42.5,
    },
    {
      badge: "Washable",
      image:
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop",
      name: "Striped cotton crewneck tee",
      price: 19.99,
      colorDots: ["#e3b341", "#8fb8d8", "#efe6d6"],
    },
    {
      badge: "6 Colours",
      image:
        "https://images.unsplash.com/photo-1503944168849-7b4a9b2c5c1d?q=80&w=600&auto=format&fit=crop",
      name: "Canvas low-top sneakers",
      price: 38.5,
      salePrice: 28.5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=600&auto=format&fit=crop",
      name: "Mini backpack with patches",
      price: 32.99,
    },
    {
      badge: "Easy Iron",
      image:
        "https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=600&auto=format&fit=crop",
      name: "Cotton flannel shirt",
      price: 29.99,
      thumbs: [
        "https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1604576238586-d1afb3c4d2c0?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1604917877934-07d8d248d396?q=80&w=100&auto=format&fit=crop",
      ],
    },
    {
      badge: "Online Exclusive",
      image:
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop",
      name: "Double-breasted wool coat (kids)",
      price: 46.99,
    },
    {
      badge: "New Now",
      badgeDark: true,
      image:
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600&auto=format&fit=crop",
      name: "Suede velcro sport shoes",
      price: 35.5,
      miniSizes: [{ label: "28" }, { label: "29", sel: true }, { label: "30" }],
    },
    {
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&auto=format&fit=crop",
      name: "Soft fleece pullover hoodie",
      price: 34.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1604917877934-07d8d248d396?q=80&w=600&auto=format&fit=crop",
      name: "Knit beanie & mitten set",
      price: 18.5,
      salePrice: 12.59,
      colourCount: 3,
    },
    {
      image:
        "https://images.unsplash.com/photo-1622445275649-3e0debcdcb4f?q=80&w=600&auto=format&fit=crop",
      name: "Cotton jersey jogger pants",
      price: 24.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=600&auto=format&fit=crop",
      name: "Combo x 3 ankle socks",
      price: 10.69,
    },
    {
      image:
        "https://images.unsplash.com/photo-1503944168849-7b4a9b2c5c1d?q=80&w=600&auto=format&fit=crop",
      name: "Round frame sunglasses, kids",
      price: 19.9,
    },
  ],

  recentlyViewed: [
    {
      image:
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=400&auto=format&fit=crop",
      name: "Padded hooded puffer jacket",
      price: 58.5,
      salePrice: 42.5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=400&auto=format&fit=crop",
      name: "Suede velcro sport shoes",
      price: 35.5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1604917877934-07d8d248d396?q=80&w=400&auto=format&fit=crop",
      name: "Knit beanie & mitten set",
      price: 18.5,
      salePrice: 12.59,
    },
    {
      image:
        "https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=400&auto=format&fit=crop",
      name: "Cotton flannel shirt",
      price: 29.99,
    },
    {
      image:
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400&auto=format&fit=crop",
      name: "Striped cotton crewneck tee",
      price: 19.99,
    },
  ],
};

export function Kids(){
  return <CollectionPage config={config} />;
}



   