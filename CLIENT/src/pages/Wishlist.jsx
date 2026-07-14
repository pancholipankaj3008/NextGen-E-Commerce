import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect } from "react";
import "../index.css"
import { Link } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import SkeletonGrid from "../components/SkeletonGrid";

import { AddToCart } from "../features/cart/cartThunk";

import {
  GetWishlist,
  RemoveWishlist,
} from "../features/wishlist/wishlistThunk";

import {
  ClearWishlistMessage,
} from "../features/wishlist/wishlistSlice";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { firstAvailableVariant } from "../utils/product";

export function Wishlist() {
  const dispatch = useAppDispatch();

  const {
    wishlist,
    loading,
    message,
    error,
  } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(GetWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(ClearWishlistMessage());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, message, error]);

  const handleAddToCart = (product) => {
    const variant = firstAvailableVariant(product);

    dispatch(
      AddToCart({
        productId: product._id || product.id,
        quantity: 1,
        ...variant,
      })
    );
  };

  const handleRemoveWishlist = (product) => {
    dispatch(
      RemoveWishlist(
        product._id || product.id
      )
    );
  };

  return (
    <main className="page">

      <section className="section-tight">
        <div className="container">

          <span className="eyebrow">
            Saved
          </span>

          <h1 className="title">
            Wishlist
          </h1>

        </div>
      </section>


      <section
        className="section"
        style={{ paddingTop: 0 }}
      >
        <div className="container">

          {message && (
            <div
              className="card"
              style={{
                padding: 12,
                marginBottom: 18,
              }}
            >
              {message}
            </div>
          )}


          {error && (
            <div
              className="card"
              style={{
                padding: 12,
                marginBottom: 18,
              }}
            >
              {error}
            </div>
          )}


          {loading && wishlist.length === 0 ? (

            <SkeletonGrid />

          ) : wishlist.length === 0 ? (

            <EmptyState
              icon={<Heart />}
              title="Your wishlist is quiet"
              text="Save pieces you love and move them to cart when you are ready."
              action={
                <Link
                  className="btn btn-primary"
                  to="/products"
                >
                  Explore Products
                </Link>
              }
            />

          ) : (

            <div className="grid grid-4">

              {wishlist.map((item) => {

                const product =
                  item.product || item;

                return (
                  <ProductCard
                    key={
                      product._id ||
                      product.id ||
                      product.slug
                    }
                    product={product}
                    isWishlisted={true}

                    onCart={() =>
                      handleAddToCart(product)
                    }

                    onWishlist={() =>
                      handleRemoveWishlist(product)
                    }
                  />
                );
              })}

            </div>

          )}


          {wishlist.length > 0 && (

            <button
              className="btn btn-danger"
              style={{ marginTop: 22 }}
              type="button"
            >
              <Trash2 size={16} />
              Remove selected through each product heart
            </button>

          )}

        </div>
      </section>

    </main>
  );
}