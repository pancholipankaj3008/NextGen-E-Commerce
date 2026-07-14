import HeroCarousel from "../components/Hero";
import TopStrip from "../components/Strip";
import CollectionGrid from "../components/CollectionGrid";
import CollectionShowcase from "../components/CollectionShowcase";
import PromoNewsletter from "../components/PromoNewsletter";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import {
  GetFeaturedProducts as fetchFeaturedProducts,
  GetNewArrivals as fetchNewArrivals,
  GetTrendingProducts as fetchTrendingProducts,
} from "../features/product/productThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

function BackendProductRails() {
  const dispatch = useAppDispatch();
  const { featuredProducts, trendingProducts, newArrivals } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchTrendingProducts());
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const rails = [
    ["Editor's Picks", featuredProducts],
    ["Trending Now", trendingProducts],
    ["Just Dropped", newArrivals],
  ];

  return (
    <>
    <section className="section" style={{ background: "#faf8f5" }}>
      <div className="container" style={{ display: "grid", gap: 42 }}>
        {rails.map(([title, products]) => (
          <div key={title}>
            <span className="eyebrow">Backend Collection</span>
            <h2 className="title" style={{ marginBottom: 20 }}>{title}</h2>
            {products.length === 0 ? (
              <div className="empty-state" style={{ padding: 28 }}>No {title.toLowerCase()} from backend yet.</div>
            ) : (
              <div className="grid grid-4">{products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}</div>
            )}
          </div>
        ))}
      </div>
    </section>
              </>
  );
}

export function Home() {
  return (
    <>
      <HeroCarousel />
      <TopStrip />
      <CollectionGrid />
      <BackendProductRails />
      <CollectionShowcase />
      <PromoNewsletter />
    </>
  );
}
