import { SlidersHorizontal } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

import EmptyState from "../components/EmptyState";

import ProductCard from "../components/ProductCard";

import SkeletonGrid from "../components/SkeletonGrid";

import { GetAllProducts } from "../features/product/productThunk";

import { AddToCart } from "../features/cart/cartThunk";

import {
    AddToWishlist,
    RemoveWishlist
} from "../features/wishlist/wishlistThunk";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import { firstAvailableVariant } from "../utils/product";
import { backendGender, backendSort } from "../utils/product";

const emptyArray = [];



export function Products({ gender, collection }) {

    const [params, setParams] = useSearchParams();

    const navigate = useNavigate();

    const dispatch = useAppDispatch();



    const [filters, setFilters] = useState({

        category: params.get("category") || "",

        gender:
            gender ||
            params.get("gender") ||
            "",

        collection:
            collection ||
            params.get("collection") ||
            "",

        sort:
            params.get("sort") ||
            "newest",

        search:
            params.get("search") ||
            "",

        price:
            params.get("price") ||
            "",

        sale:
            params.get("sale") ||
            "",

        page:
            Number(
                params.get("page")
            ) || 1

    });

    const [filtersOpen, setFiltersOpen] = useState(false);
    const paramsKey = params.toString();



    const {

        products,

        loading,

        totalPages,

        currentPage

    } = useAppSelector(
        (state) => state.product
    );



    const {

        user,

        isAuthenticated

    } = useAppSelector(
        (state) => state.auth
    );



    const wishlistItems = useAppSelector(
        (state) =>
            state.wishlist?.items ||
            state.wishlist?.wishlist ||
            user?.wishlist ||
            emptyArray
    );



    const wishlistIds = useMemo(() => {

        return new Set(

            wishlistItems.map((item) =>

                String(

                    item.product?._id ||

                    item.product ||

                    item._id ||

                    item.id ||

                    item

                )

            )

        );

    }, [wishlistItems]);



    useEffect(() => {

        const nextFilters = {
            category: params.get("category") || "",
            gender: gender || params.get("gender") || "",
            collection: collection || params.get("collection") || "",
            sort: params.get("sort") || "newest",
            search: params.get("search") || "",
            price: params.get("price") || "",
            sale: params.get("sale") || "",
            page: Number(params.get("page")) || 1,
        };

        setFilters((prev) => {
            const changed = Object.keys(nextFilters).some(
                (key) => String(prev[key] ?? "") !== String(nextFilters[key] ?? "")
            );

            return changed ? nextFilters : prev;
        });

    }, [collection, gender, paramsKey]);



    useEffect(() => {

        const next = {

            ...filters,

            gender:
                gender ||
                filters.gender,

            collection:
                collection ||
                filters.collection

        };



        const apiParams = {};



        Object.entries(next).forEach(
            ([key, value]) => {

                if (

                    value !== "" &&

                    value !== null &&

                    value !== undefined

                ) {

                    if (key === "gender") {
                        apiParams[key] = backendGender(value);
                    } else if (key === "sort") {
                        apiParams[key] = backendSort(value);
                    } else if (key !== "sale" && key !== "price") {
                        apiParams[key] = value;
                    }

                }

            }
        );



        dispatch(
            GetAllProducts(apiParams)
        );



        const urlParams = {};



        Object.entries(next).forEach(
            ([key, value]) => {

                if (

                    value !== "" &&

                    value !== null &&

                    value !== undefined &&

                    !(key === "page" && Number(value) === 1)

                ) {

                    urlParams[key] = value;

                }

            }
        );



        setParams(
            urlParams,
            {
                replace: true
            }
        );

    }, [

        collection,

        dispatch,

        gender,

        filters,

        setParams

    ]);



    const update = (key, value) => {

        setFilters((prev) => ({

            ...prev,

            [key]: value,

            page:
                key === "page"
                    ? value
                    : 1

        }));

    };



    const header = useMemo(() => {

        if (filters.search) {

            return `Search: ${filters.search}`;

        }



        if (filters.gender) {

            return filters.gender;

        }



        if (filters.collection) {

            return filters.collection;

        }



        if (filters.sale) {

            return "Sale";

        }



        return "All Products";

    }, [filters]);



const HandleAddToCart = async (product) => {

    if (!isAuthenticated) {

        navigate("/auth");

        return;

    }

    const variant = firstAvailableVariant(product);

    await dispatch(

        AddToCart({

            productId: product._id,

            color: variant.color,

            size: variant.size,

            quantity: 1

        })

    );

};



    const HandleWishlist = async (product) => {

        if (!isAuthenticated) {

            navigate("/auth");

            return;

        }



        const productId =
            product._id ||
            product.id;



        if (

            wishlistIds.has(
                String(productId)
            )

        ) {

            await dispatch(
                RemoveWishlist(productId)
            );

        }

        else {

            await dispatch(
                AddToWishlist(productId)
            );

        }

    };



    return (

        <main className="page">

            <section className="section-tight">

                <div className="container">

                    <span className="eyebrow">

                        Shop

                    </span>

                    <h1
                        className="title"
                        style={{
                            textTransform: "capitalize"
                        }}
                    >

                        {header}

                    </h1>

                </div>

            </section>



            <section
                className="section"
                style={{
                    paddingTop: 0
                }}
            >

                <div className="container product-list-layout">

                    <div className="product-filter-toggle">
                        <button className="btn btn-secondary" type="button" onClick={() => setFiltersOpen((open) => !open)}>
                            <SlidersHorizontal size={16} />
                            {filtersOpen ? "Hide Filters" : "Show Filters"}
                        </button>
                    </div>

                    <aside
                        className={`card product-filter-panel ${filtersOpen ? "open" : ""}`}
                        style={{
                            padding: 18,
                            height: "fit-content",
                            display: "grid",
                            gap: 14
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8
                            }}
                        >

                            <SlidersHorizontal size={16} />

                            <span className="eyebrow">

                                Filters

                            </span>

                        </div>



                        <div className="field">

                            <label>

                                Search

                            </label>

                            <input
                                className="input"
                                value={filters.search}
                                onChange={(e) =>
                                    update(
                                        "search",
                                        e.target.value
                                    )
                                }
                            />

                        </div>



                        <div className="field">

                            <label>

                                Category

                            </label>

                            <input
                                className="input"
                                value={filters.category}
                                onChange={(e) =>
                                    update(
                                        "category",
                                        e.target.value
                                    )
                                }
                                placeholder="Jackets, Shirts"
                            />

                        </div>



                        <div className="field">

                            <label>

                                Collection

                            </label>

                            <select
                                className="select"
                                value={filters.collection}
                                onChange={(e) =>
                                    update(
                                        "collection",
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">

                                    All

                                </option>

                                <option value="Summer Collection">

                                    Summer Collection

                                </option>

                                <option value="Winter Drop">

                                    Winter Drop

                                </option>

                                <option value="Streetwear Collection">

                                    Streetwear Collection

                                </option>

                                <option value="Limited Edition">

                                    Limited Edition

                                </option>

                            </select>

                        </div>



                        <div className="field">

                            <label>

                                Sort

                            </label>

                            <select
                                className="select"
                                value={filters.sort}
                                onChange={(e) =>
                                    update(
                                        "sort",
                                        e.target.value
                                    )
                                }
                            >

                                <option value="newest">

                                    Newest

                                </option>

                                <option value="price-low">

                                    Price Low To High

                                </option>

                                <option value="price-high">

                                    Price High To Low

                                </option>

                                <option value="popularity">

                                    Popularity

                                </option>

                            </select>

                        </div>

                    </aside>



                    <div>

                        {
                            loading
                                ? (

                                    <SkeletonGrid />

                                )
                                : products.length === 0
                                    ? (

                                        <EmptyState
                                            title="No pieces found"
                                            text="Try changing filters or searching another collection."
                                            icon={
                                                <SlidersHorizontal />
                                            }
                                        />

                                    )
                                    : (

                                        <div className="grid grid-3 product-results-grid">

                                            {
                                                products.map(
                                                    (product) => (

                                                        <ProductCard

                                                            key={
                                                                product._id ||
                                                                product.slug
                                                            }

                                                            product={
                                                                product
                                                            }

                                                            onCart={() =>
                                                                HandleAddToCart(
                                                                    product
                                                                )
                                                            }

                                                            isWishlisted={
                                                                wishlistIds.has(
                                                                    String(
                                                                        product._id
                                                                    )
                                                                )
                                                            }

                                                            onWishlist={() =>
                                                                HandleWishlist(
                                                                    product
                                                                )
                                                            }

                                                        />

                                                    )
                                                )
                                            }

                                        </div>

                                    )
                        }



                        {
                            totalPages > 1 && (

                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        justifyContent: "center",
                                        marginTop: 26
                                    }}
                                >

                                    {
                                        Array.from({
                                            length: totalPages
                                        }).map(
                                            (_, index) => (

                                                <button
                                                    key={index}
                                                    className={
                                                        `btn ${
                                                            Number(
                                                                currentPage ||
                                                                filters.page
                                                            ) === index + 1
                                                                ? "btn-primary"
                                                                : "btn-soft"
                                                        }`
                                                    }
                                                    onClick={() =>
                                                        update(
                                                            "page",
                                                            index + 1
                                                        )
                                                    }
                                                >

                                                    {index + 1}

                                                </button>

                                            )
                                        )
                                    }

                                </div>

                            )
                        }

                    </div>

                </div>

            </section>

        </main>

    );

}
