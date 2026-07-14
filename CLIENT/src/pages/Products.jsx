import { SlidersHorizontal, ArrowLeft, Search, Heart, ShoppingBag, ArrowUpDown, X } from "lucide-react";

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

const SORT_CHIPS = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popularity", label: "Popularity" },
];

const COLLECTION_CHIPS = [
    { value: "", label: "All" },
    { value: "Summer Collection", label: "Summer" },
    { value: "Winter Drop", label: "Winter Drop" },
    { value: "Streetwear Collection", label: "Streetwear" },
    { value: "Limited Edition", label: "Limited Edition" },
];

/**
 * MOBILE LAYOUT NOTE:
 * On screens <= 768px this renders a Flipkart-style shop header (back
 * arrow, page title, search/wishlist/bag icons), a Sort | Filter row,
 * and a horizontally scrollable collection chip row — restyled in the
 * NextGen premium palette (beige/olive/gold, Cormorant Garamond for the
 * title) instead of the bright reference colours. The existing filter
 * panel (category, search, collection dropdown, sort dropdown) is kept
 * for desktop and still opens on mobile via the "Filter" chip.
 *
 * Note: individual product cards are rendered by <ProductCard /> (not
 * included in this file), so the rating badge / discount tag / always
 * visible wishlist heart from the reference image can't be added here —
 * share ProductCard.jsx and I'll match those too.
 */

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
    const [mobileSortOpen, setMobileSortOpen] = useState(false);
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

        <main className="page ng-products">

            <style>{`
                .ng-products {
                    --ng-ink: #2f2b22;
                    --ng-ink-soft: #736b58;
                    --ng-bg: #faf7f0;
                    --ng-line: #e6ded0;
                    --ng-olive: #6b6b47;
                    --ng-gold: #a6863f;
                }

                /* ---------- Mobile shop header (Flipkart-style), hidden on desktop ---------- */
                .ng-m-topbar {
                    display: none;
                    align-items: center;
                    justify-content: space-between;
                    gap: 14px;
                    padding: 14px 18px;
                    background: var(--ng-ink);
                    color: #fff;
                    position: sticky;
                    top: 0;
                    z-index: 20;
                }
                .ng-m-topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
                .ng-m-topbar-left button, .ng-m-topbar-icons button {
                    background: none; border: none; color: #fff; display: flex; padding: 2px;
                }
                .ng-m-topbar-title {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-size: 19px;
                    letter-spacing: 0.03em;
                    text-transform: capitalize;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .ng-m-topbar-icons { display: flex; align-items: center; gap: 18px; flex-shrink: 0; }
                .ng-m-topbar-icons button { position: relative; }
                .ng-m-topbar-icons .dot {
                    position: absolute; top: -3px; right: -5px;
                    width: 8px; height: 8px; border-radius: 50%;
                    background: var(--ng-gold);
                }

                /* ---------- Mobile sort/filter row ---------- */
                .ng-m-sortfilter {
                    display: none;
                    border-bottom: 1px solid var(--ng-line);
                    background: var(--ng-bg);
                }
                .ng-m-sortfilter button {
                    flex: 1;
                    display: flex; align-items: center; justify-content: center; gap: 7px;
                    background: none; border: none;
                    padding: 13px 10px;
                    font-size: 12.5px;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: var(--ng-ink-soft);
                }
                .ng-m-sortfilter button.active { color: var(--ng-ink); font-weight: 600; }
                .ng-m-sortfilter button:first-child { border-right: 1px solid var(--ng-line); }

                /* ---------- Mobile sort sheet ---------- */
                .ng-m-sort-sheet {
                    display: none;
                }
                .ng-m-sort-sheet.open {
                    display: block;
                    background: #fff;
                    border-bottom: 1px solid var(--ng-line);
                    padding: 6px 18px 12px;
                }
                .ng-m-sort-option {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 12px 0;
                    font-size: 13.5px;
                    color: var(--ng-ink-soft);
                    border-bottom: 1px solid var(--ng-line);
                }
                .ng-m-sort-option:last-child { border-bottom: none; }
                .ng-m-sort-option.active { color: var(--ng-gold); font-weight: 600; }

                /* ---------- Mobile collection chip row ---------- */
                .ng-m-chips {
                    display: none;
                    gap: 10px;
                    padding: 14px 18px;
                    overflow-x: auto;
                    scrollbar-width: none;
                    border-bottom: 1px solid var(--ng-line);
                    background: var(--ng-bg);
                }
                .ng-m-chips::-webkit-scrollbar { display: none; }
                .ng-m-chip {
                    flex-shrink: 0;
                    padding: 9px 16px;
                    border: 1px solid var(--ng-line);
                    border-radius: 20px;
                    font-size: 12px;
                    letter-spacing: 0.03em;
                    color: var(--ng-ink-soft);
                    background: #fff;
                    white-space: nowrap;
                }
                .ng-m-chip.active {
                    border-color: var(--ng-gold);
                    background: var(--ng-gold);
                    color: #fff;
                    font-weight: 600;
                }

                .ng-desktop-title { }

                @media (max-width: 768px) {
                    .ng-m-topbar { display: flex; }
                    .ng-m-sortfilter { display: flex; }
                    .ng-m-chips { display: flex; }
                    .ng-desktop-title { display: none; }
                    .product-filter-toggle { display: none !important; } /* replaced by ng-m-sortfilter */
                }
            `}</style>

            {/* MOBILE SHOP HEADER (Flipkart-style) */}
            <div className="ng-m-topbar">
                <div className="ng-m-topbar-left">
                    <button aria-label="Back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
                    <span className="ng-m-topbar-title">{header}</span>
                </div>
                <div className="ng-m-topbar-icons">
                    {/* <button aria-label="Search"><Search size={19} /></button> */}
                    <button aria-label="Wishlist" onClick={() => navigate("/wishlist")}><Heart size={19} /></button>
                    {/* <button aria-label="Bag" onClick={() => navigate("/cart")}>
                        <ShoppingBag size={19} />
                        <span className="dot" />
                    </button> */}
                </div>
            </div>

            {/* MOBILE SORT / FILTER ROW */}
            <div className="ng-m-sortfilter">
                <button
                    className={mobileSortOpen ? "active" : ""}
                    onClick={() => setMobileSortOpen((v) => !v)}
                >
                    <ArrowUpDown size={14} /> Sort
                </button>
                <button
                    className={filtersOpen ? "active" : ""}
                    onClick={() => setFiltersOpen((v) => !v)}
                >
                    {filtersOpen ? <X size={14} /> : <SlidersHorizontal size={14} />} Filter
                </button>
            </div>

            {/* MOBILE SORT SHEET */}
            <div className={`ng-m-sort-sheet ${mobileSortOpen ? "open" : ""}`}>
                {SORT_CHIPS.map((s) => (
                    <div
                        key={s.value}
                        className={`ng-m-sort-option ${filters.sort === s.value ? "active" : ""}`}
                        onClick={() => {
                            update("sort", s.value);
                            setMobileSortOpen(false);
                        }}
                    >
                        {s.label}
                    </div>
                ))}
            </div>

            {/* MOBILE COLLECTION CHIPS */}
            <div className="ng-m-chips">
                {COLLECTION_CHIPS.map((c) => (
                    <div
                        key={c.value || "all"}
                        className={`ng-m-chip ${filters.collection === c.value ? "active" : ""}`}
                        onClick={() => update("collection", c.value)}
                    >
                        {c.label}
                    </div>
                ))}
            </div>

            <section className="section-tight ng-desktop-title">

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