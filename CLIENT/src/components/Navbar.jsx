import {
    Heart,
    Home,
    Menu,
    Search,
    ShoppingBag,
    User,
    X
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useAppDispatch,
    useAppSelector
} from "../hooks/reduxHooks";

import {
    searchProducts
} from "../features/search/searchSlice";

import {
    GetCart
} from "../features/cart/cartThunk";

import {
    GetWishlist
} from "../features/wishlist/wishlistThunk";

const emptyArray = [];


export default function Navbar() {

    const [mobileOpen, setMobileOpen] = useState(false);

    const [searchOpen, setSearchOpen] = useState(false);

    const [showBottomNav, setShowBottomNav] = useState(true);

    const [query, setQuery] = useState("");



    const navigate = useNavigate();

    const location = useLocation();

    const dispatch = useAppDispatch();



    const {
        user,
        isAuthenticated
    } = useAppSelector(
        (state) => state.auth
    );



    const cartItems = useAppSelector(
        (state) =>
            state.cart?.items ||
            state.cart?.cart?.items ||
            emptyArray
    );



    const wishlistItems = useAppSelector(
        (state) =>
            state.wishlist?.items ||
            state.wishlist?.wishlist ||
            emptyArray
    );



    const suggestions = useAppSelector(
        (state) =>
            state.search?.suggestions || emptyArray
    );



    const cartCount = cartItems.reduce(
        (total, item) => {

            return total + Number(
                item.quantity || 0
            );

        },
        0
    );



    const wishlistCount =
        wishlistItems.length;



    const navLinks = useMemo(
        () => [

            {
                name: "Home",
                path: "/"
            },

            {
                name: "Men",
                path: "/products?gender=Men"
            },

            {
                name: "Women",
                path: "/products?gender=Women"
            },

            {
                name: "Kids",
                path: "/products?gender=Kids"
            },

            {
                name: "Sale",
                path: "/products?sale=true"
            }

        ],
        []
    );



    const isPrivileged = [

        "admin",

        "product manager",

        "inventory staff",

        "order manager"

    ].includes(user?.role);



    const accountPath = !isAuthenticated
        ? "/auth"
        : isPrivileged
            ? "/admin"
            : "/account";



    const isLinkActive = (path) => {

        const [
            pathname,
            search = ""
        ] = path.split("?");



        if (pathname !== location.pathname) {

            return false;

        }



        if (!search) {

            return location.search === "";

        }



        return location.search === `?${search}`;

    };



    useEffect(() => {

        let lastY = window.scrollY;



        const handleScroll = () => {

            const currentY = window.scrollY;



            if (
                Math.abs(currentY - lastY) < 5
            ) {

                return;

            }



            setShowBottomNav(
                currentY < lastY
            );



            lastY = currentY;

        };



        window.addEventListener(
            "scroll",
            handleScroll
        );



        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll
            );

        };

    }, []);



    useEffect(() => {

        if (!isAuthenticated) {

            return;

        }



        dispatch(
            GetCart()
        );



        dispatch(
            GetWishlist()
        );

    }, [
        dispatch,
        isAuthenticated
    ]);



    useEffect(() => {

        const value = query.trim();



        if (!value) {

            return;

        }



        const timer = window.setTimeout(
            () => {

                dispatch(
                    searchProducts(value)
                );

            },
            350
        );



        return () => {

            window.clearTimeout(timer);

        };

    }, [
        dispatch,
        query
    ]);



    useEffect(() => {

        closePanels();

    }, [
        location.pathname,
        location.search
    ]);



    const closePanels = () => {

        setMobileOpen(false);

        setSearchOpen(false);

    };



    const submitSearch = (event) => {

        event.preventDefault();



        const value = query.trim();



        if (!value) {

            return;

        }



        closePanels();



        navigate(
            `/products?search=${encodeURIComponent(value)}`
        );

    };



    const HandleSuggestionClick = (item) => {

        closePanels();



        setQuery("");



        navigate(
            `/product/${item._id || item.id}`
        );

    };

    


    return (
        <>
        

<style>{`
        .ng-old-nav {
          position: sticky;
          top: 0;
          z-index: 80;
          width: 100%;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(10,10,10,0.1);
          font-family: 'DM Sans', sans-serif;
        }

        .ng-old-nav-inner {
          max-width: 1280px;
          height: 64px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .ng-old-nav-left,
        .ng-old-nav-actions,
        .ng-old-nav-links {
          display: flex;
          align-items: center;
        }

        .ng-old-nav-left { gap: 12px; }
        .ng-old-nav-actions { gap: 16px; }
        .ng-old-nav-links { gap: 38px; }

        .ng-old-brand {
          color: #0a0a0a;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition: transform 0.25s ease, letter-spacing 0.25s ease;
        }

        .ng-old-brand:hover {
          transform: scale(1.04);
          letter-spacing: 0.19em;
        }

        .ng-old-link {
          position: relative;
          color: #6b6b6b;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          transition: color 0.25s ease;
        }

        .ng-old-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -7px;
          width: 0;
          height: 2px;
          background: #0a0a0a;
          transition: width 0.25s ease;
        }

        .ng-old-link:hover,
        .ng-old-link.active {
          color: #0a0a0a;
        }

        .ng-old-link:hover::after,
        .ng-old-link.active::after {
          width: 100%;
        }

        .ng-old-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #555;
          transition: transform 0.25s ease, color 0.25s ease;
        }

        .ng-old-icon:hover {
          color: #0a0a0a;
          transform: scale(1.12);
        }

        .ng-old-count {
          position: absolute;
          top: -8px;
          right: -8px;
          min-width: 17px;
          height: 17px;
          border-radius: 999px;
          background: #0a0a0a;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          font-size: 10px;
          line-height: 1;
        }

        .ng-old-search {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 260px;
          padding: 8px 16px;
          border: 1px solid #d8d4ce;
          border-radius: 999px;
          background: rgba(255,255,255,0.65);
        }

        .ng-old-search input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 13px;
          color: #0a0a0a;
        }

        .ng-old-search-panel {
          position: fixed;
          top: 76px;
          right: 24px;
          z-index: 120;
          width: min(420px, calc(100vw - 32px));
          max-height: min(420px, calc(100vh - 96px));
          overflow: auto;
          background: #fff;
          border: 1px solid #e5e1db;
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          transform: translateY(-12px) scale(0.98);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.22s ease, opacity 0.22s ease;
        }

        .ng-old-search-panel.open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: auto;
        }

        .ng-old-search-box {
          padding: 16px;
        }

        .ng-old-search-row {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #dedbd5;
          border-radius: 12px;
          padding: 10px 12px;
        }

        .ng-old-search-row input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
        }

        .ng-old-mobile-menu-btn {
          display: none;
        }

        .ng-old-mobile-menu {
          display: none;
        }

        .ng-old-bottom-nav {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          height: 56px;
          display: none;
          align-items: center;
          justify-content: space-around;
          background: rgba(17,17,17,0.92);
          backdrop-filter: blur(14px);
          color: #fff;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .ng-old-bottom-nav.hidden {
          transform: translateY(100%);
          opacity: 0;
        }

        .ng-old-bottom-link,
        .ng-old-bottom-btn {
          border: none;
          background: transparent;
          color: #a8a8a8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        .ng-old-bottom-link.active,
        .ng-old-bottom-link:hover,
        .ng-old-bottom-btn.active,
        .ng-old-bottom-btn:hover {
          color: #fff;
          transform: scale(1.08);
        }

        .ng-old-suggestions {
          margin-top: 12px;
          display: grid;
          gap: 8px;
        }

        .ng-old-suggestion {
          width: 100%;
          border: 1px solid #eee9e3;
          background: #faf8f5;
          border-radius: 8px;
          padding: 10px 12px;
          text-align: left;
          font-size: 13px;
        }

        @media (max-width: 1024px) {
          .ng-old-search,
          .ng-old-nav-links,
          .ng-old-desktop-action {
            display: none;
          }

          .ng-old-mobile-menu-btn {
            display: inline-flex;
          }

          .ng-old-nav-inner {
            padding: 0 18px;
          }

          .ng-old-mobile-menu {
            display: block;
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            background: #fff;
            border-top: 1px solid #eee9e3;
            transition: max-height 0.35s ease, opacity 0.25s ease;
          }

          .ng-old-mobile-menu.open {
            max-height: 360px;
            opacity: 1;
          }

          .ng-old-mobile-menu a {
            display: block;
            padding: 14px 24px;
            border-bottom: 1px solid #eee9e3;
            color: #1a1a1a;
            font-size: 13px;
            font-weight: 600;
            transition: background 0.2s ease, padding-left 0.2s ease;
          }

          .ng-old-mobile-menu a:hover {
            background: #f4f1eb;
            padding-left: 32px;
          }

          .ng-old-bottom-nav {
            display: flex;
          }

          .ng-old-search-panel {
            top: 68px;
            left: 12px;
            right: 12px;
            width: auto;
            max-height: 70vh;
          }
        }

        @media (max-width: 520px) {
          .ng-old-brand {
            font-size: 20px;
            letter-spacing: 0.12em;
          }

          .ng-old-nav-inner {
            height: 60px;
          }
        }
      `}</style>

            <nav className="ng-old-nav">

                <div className="ng-old-nav-inner">

                    <div className="ng-old-nav-left">

                        <button
                            className="ng-old-icon ng-old-mobile-menu-btn"
                            type="button"
                            aria-label="Menu"
                            onClick={() => {

                                setMobileOpen(
                                    (open) => !open
                                );

                                setSearchOpen(false);

                            }}
                        >

                            {
                                mobileOpen
                                    ? <X size={24} />
                                    : <Menu size={24} />
                            }

                        </button>



                        <NavLink
                            to="/"
                            className="ng-old-brand"
                            onClick={closePanels}
                        >

                            NextGEN

                        </NavLink>

                    </div>



                    <div className="ng-old-nav-links">

                        {
                            navLinks.map((link) => (

                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={
                                        `ng-old-link ${
                                            isLinkActive(link.path)
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                >

                                    {link.name}

                                </Link>

                            ))
                        }

                    </div>



                    <div className="ng-old-nav-actions">

                        <form
                            className="ng-old-search"
                            onSubmit={submitSearch}
                        >

                            <Search size={16} />



                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(
                                        event.target.value
                                    )
                                }
                                placeholder="Search products..."
                            />

                        </form>



                        <NavLink
                            className="ng-old-icon ng-old-desktop-action"
                            to={
                                isAuthenticated
                                    ? "/wishlist"
                                    : "/auth"
                            }
                            aria-label="Wishlist"
                        >

                            <Heart size={22} />



                            {
                                wishlistCount > 0 && (

                                    <span className="ng-old-count">

                                        {wishlistCount}

                                    </span>

                                )
                            }

                        </NavLink>



                        <NavLink
                            className="ng-old-icon ng-old-desktop-action"
                            to={accountPath}
                            aria-label="Account"
                        >

                            <User size={22} />

                        </NavLink>



                        <NavLink
                            className="ng-old-icon"
                            to={
                                isAuthenticated
                                    ? "/cart"
                                    : "/auth"
                            }
                            aria-label="Cart"
                        >

                            <ShoppingBag size={22} />



                            {
                                cartCount > 0 && (

                                    <span className="ng-old-count">

                                        {cartCount}

                                    </span>

                                )
                            }

                        </NavLink>

                    </div>

                </div>



                <div
                    className={
                        `ng-old-mobile-menu ${
                            mobileOpen
                                ? "open"
                                : ""
                        }`
                    }
                >

                    {
                        navLinks.map((link) => (

                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={closePanels}
                            >

                                {link.name}

                            </Link>

                        ))
                    }

                </div>

            </nav>



            <div
                className={
                    `ng-old-search-panel ${
                        searchOpen
                            ? "open"
                            : ""
                    }`
                }
            >

                <div className="ng-old-search-box">

                    <form
                        className="ng-old-search-row"
                        onSubmit={submitSearch}
                    >

                        <Search size={18} />



                        <input
                            autoFocus={searchOpen}
                            value={query}
                            onChange={(event) =>
                                setQuery(
                                    event.target.value
                                )
                            }
                            placeholder="Search products..."
                        />



                        <button
                            className="ng-old-icon"
                            type="button"
                            onClick={() =>
                                setSearchOpen(false)
                            }
                            aria-label="Close search"
                        >

                            <X size={20} />

                        </button>

                    </form>



                    {
                        query.trim() &&
                        suggestions.length > 0 && (

                            <div className="ng-old-suggestions">

                                {
                                    suggestions
                                        .slice(0, 5)
                                        .map((item) => (

                                            <button
                                                key={
                                                    item._id ||
                                                    item.slug
                                                }
                                                type="button"
                                                className="ng-old-suggestion"
                                                onClick={() =>
                                                    HandleSuggestionClick(item)
                                                }
                                            >

                                                {item.title}

                                            </button>

                                        ))
                                }

                            </div>

                        )
                    }

                </div>

            </div>



            <div
                className={
                    `ng-old-bottom-nav ${
                        showBottomNav
                            ? ""
                            : "hidden"
                    }`
                }
            >

                <NavLink
                    to="/"
                    className="ng-old-bottom-link"
                    onClick={closePanels}
                >

                    <Home size={20} />

                    Home

                </NavLink>



                <button
                    type="button"
                    className={
                        `ng-old-bottom-btn ${
                            searchOpen
                                ? "active"
                                : ""
                        }`
                    }
                    onClick={() => {

                        setSearchOpen(
                            (open) => !open
                        );

                        setMobileOpen(false);

                    }}
                >

                    <Search size={20} />

                    Search

                </button>



                <NavLink
                    to={
                        isAuthenticated
                            ? "/wishlist"
                            : "/auth"
                    }
                    className="ng-old-bottom-link"
                    onClick={closePanels}
                >

                    <Heart size={20} />

                    Wishlist

                </NavLink>



                <NavLink
                    to={accountPath}
                    className="ng-old-bottom-link"
                    onClick={closePanels}
                >

                    <User size={20} />



                    {
                        !isAuthenticated
                            ? "Login"
                            : isPrivileged
                                ? "Admin"
                                : "Account"
                    }

                </NavLink>

            </div>

        </>
    );
}



// import { Heart, Home, Menu, Search, ShoppingBag, User, X } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
// import { searchProducts } from "../features/search/searchSlice";

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [showBottomNav, setShowBottomNav] = useState(true);
//   const [query, setQuery] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   const user = useAppSelector((state) => state.auth.user);
//   const cartCount = useAppSelector((state) => state.cart.items.length);
//   const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
//   const suggestions = useAppSelector((state) => state.search.suggestions);

//   const navLinks = useMemo(
//     () => [
//       { name: "Home", path: "/" },
//       { name: "Men", path: "/products?gender=men" },
//       { name: "Women", path: "/products?gender=women" },
//       { name: "Kids", path: "/products?gender=kids" },
//       { name: "Sale", path: "/products?collection=sale" },
//     ],
//     []
//   );

//   const isPrivileged = ["admin", "product manager", "inventory staff", "order manager"].includes(user?.role);

//   const isLinkActive = (path) => {
//     const [pathname, search = ""] = path.split("?");
//     if (pathname !== location.pathname) return false;
//     if (!search) return location.search === "";
//     return location.search === `?${search}`;
//   };

//   useEffect(() => {
//     let lastY = window.scrollY;
//     const handleScroll = () => {
//       const currentY = window.scrollY;
//       if (Math.abs(currentY - lastY) < 5) return;
//       setShowBottomNav(currentY < lastY);
//       lastY = currentY;
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     if (!query.trim()) return;
//     const timer = window.setTimeout(() => dispatch(searchProducts(query.trim())), 350);
//     return () => window.clearTimeout(timer);
//   }, [dispatch, query]);

//   const closePanels = () => {
//     setMobileOpen(false);
//     setSearchOpen(false);
//   };

//   const submitSearch = (event) => {
//     event.preventDefault();
//     const value = query.trim();
//     if (!value) return;
//     closePanels();
//     navigate(`/products?search=${encodeURIComponent(value)}`);
//   };

//   return (
//     <>
      

//       <nav className="ng-old-nav">
//         <div className="ng-old-nav-inner">
//           <div className="ng-old-nav-left">
//             <button
//               className="ng-old-icon ng-old-mobile-menu-btn"
//               type="button"
//               aria-label="Menu"
//               onClick={() => {
//                 setMobileOpen((open) => !open);
//                 setSearchOpen(false);
//               }}
//             >
//               {mobileOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//             <NavLink to="/" className="ng-old-brand" onClick={closePanels}>
//               NextGEN
//             </NavLink>
//           </div>

//           <div className="ng-old-nav-links">
//             {navLinks.map((link) => (
//               <Link key={link.name} to={link.path} className={`ng-old-link ${isLinkActive(link.path) ? "active" : ""}`}>
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           <div className="ng-old-nav-actions">
//             <form className="ng-old-search" onSubmit={submitSearch}>
//               <Search size={16} />
//               <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." />
//             </form>
//             <button className="ng-old-icon" type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
//               <Search size={22} />
//             </button>
//             <NavLink className="ng-old-icon ng-old-desktop-action" to="/wishlist" aria-label="Wishlist">
//               <Heart size={22} />
//               {wishlistCount > 0 && <span className="ng-old-count">{wishlistCount}</span>}
//             </NavLink>
//             <NavLink className="ng-old-icon ng-old-desktop-action" to={isPrivileged ? "/admin" : "/account"} aria-label="Account">
//               <User size={22} />
//             </NavLink>
//             <NavLink className="ng-old-icon" to="/cart" aria-label="Cart">
//               <ShoppingBag size={22} />
//               {cartCount > 0 && <span className="ng-old-count">{cartCount}</span>}
//             </NavLink>
//           </div>
//         </div>

//         <div className={`ng-old-mobile-menu ${mobileOpen ? "open" : ""}`}>
//           {navLinks.map((link) => (
//             <Link key={link.name} to={link.path} onClick={closePanels}>
//               {link.name}
//             </Link>
//           ))}
//         </div>
//       </nav>

//       <div className={`ng-old-search-panel ${searchOpen ? "open" : ""}`}>
//         <div className="ng-old-search-box">
//           <form className="ng-old-search-row" onSubmit={submitSearch}>
//             <Search size={18} />
//             <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." />
//             <button className="ng-old-icon" type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
//               <X size={20} />
//             </button>
//           </form>
//           {query && suggestions.length > 0 && (
//             <div className="ng-old-suggestions">
//               {suggestions.slice(0, 5).map((item) => (
//                 <button
//                   key={item._id || item.slug}
//                   type="button"
//                   className="ng-old-suggestion"
//                   onClick={() => {
//                     closePanels();
//                     navigate(`/product/${item.slug || item._id}`);
//                   }}
//                 >
//                   {item.name}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className={`ng-old-bottom-nav ${showBottomNav ? "" : "hidden"}`}>
//         <NavLink to="/" className="ng-old-bottom-link" onClick={closePanels}>
//           <Home size={20} />
//           Home
//         </NavLink>
//         <button
//           type="button"
//           className={`ng-old-bottom-btn ${searchOpen ? "active" : ""}`}
//           onClick={() => {
//             setSearchOpen((open) => !open);
//             setMobileOpen(false);
//           }}
//         >
//           <Search size={20} />
//           Search
//         </button>
//         <NavLink to="/wishlist" className="ng-old-bottom-link" onClick={closePanels}>
//           <Heart size={20} />
//           Wishlist
//         </NavLink>
//         <NavLink to={isPrivileged ? "/admin" : "/account"} className="ng-old-bottom-link" onClick={closePanels}>
//           <User size={20} />
//           {isPrivileged ? "Admin" : "Account"}
//         </NavLink>
//       </div>
//     </>
//   );
// }


