import { useState, useEffect, useCallback } from "react";
import '../styles/AvexLayout.css';
import { useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Hoodies", href: "/hoodies" },
    { label: "Jeans", href: "/jeans" },
    { label: "Sneakers", href: "/sneakers" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export function NavBar({ cartCount = 2, favoritesCount = 0 }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 12);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    const isCurrentPage = (href) => {
        if (href === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(href);
    };

    return (
        <>
            <nav
                className={`nav${scrolled ? " nav--scrolled" : ""}`}
                role="navigation"
                aria-label="Primary navigation"
            >
                <a href="/" className="nav__wordmark" aria-label="AVEX — home">AVEX</a>
                <ul className="nav__links" role="list">
                    {NAV_LINKS.map(({ label, href }) => (
                        <li key={label}>
                            <a
                                href={href}
                                className="nav__link"
                                aria-current={isCurrentPage(href) ? "page" : undefined}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(href);
                                }}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="nav__actions">
                    <button
                        className="nav__favorites-btn"
                        onClick={() => navigate("/favorites")}
                        aria-label={`Favorites — ${favoritesCount} items`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {favoritesCount > 0 && (
                            <span className="nav__favorites-count" aria-hidden="true">
                                {favoritesCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="nav__cart-btn"
                        onClick={() => navigate("/cart")}
                        aria-label={`Cart — ${cartCount} items`}
                    >
                        Cart
                        {cartCount > 0 && (
                            <span className="nav__cart-count" aria-hidden="true">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="nav__menu-toggle"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-drawer"
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>
            <div
                id="mobile-drawer"
                className={`nav__drawer${menuOpen ? " nav__drawer--open" : ""}`}
                aria-hidden={!menuOpen}
            >
                <ul className="nav__drawer-links" role="list">
                    {NAV_LINKS.map(({ label, href }) => (
                        <li key={label}>
                            <a
                                href={href}
                                className="nav__drawer-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(href);
                                    setMenuOpen(false);
                                }}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="hero" aria-label="Hero">
            <div className="hero__content">
                <p className="hero__eyebrow" aria-hidden="true">SS 2026 Collection</p>
                <h1 className="hero__headline">
                    Avex<br />
                    <em>Street</em><br />
                    Culture
                </h1>
                <p className="hero__body">
                    Premium hoodies, jeans, and sneakers engineered
                    for those who move through the city on their own terms.
                </p>
                <div className="hero__cta-row">
                    <button
                        className="btn-primary"
                        aria-label="Shop the collection"
                        onClick={() => navigate("/shop")}
                    >
                        <span>Shop Collection</span>
                    </button>
                    <button
                        className="btn-ghost"
                        aria-label="View lookbook"
                    >
                        Lookbook
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                            <path d="M1 5h14M10 1l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="hero__scroll-indicator" aria-hidden="true">
                    <div className="hero__scroll-line" />
                    Scroll
                </div>
            </div>
            <div className="hero__image-panel">
                <img src="assets/images/Hero.png" alt="Hero image showing street fashion" className="hero__img" />
            </div>
        </section>
    );
}

export default function AvexLayout() {
    return (
        <>
            <NavBar cartCount={2} />
            <main>
                <HeroSection />
            </main>
        </>
    );
}