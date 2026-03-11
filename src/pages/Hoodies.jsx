import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import '../styles/Hoodies.css';
import { HOODIES } from "../data/data";
import { Link } from "react-router-dom";
const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "new", label: "New Arrivals" },
    { value: "sale", label: "On Sale" },
];
const FEATURES = [
    {
        id: "shipping",
        title: "Free Shipping",
        text: "On all orders over $120",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            </svg>
        ),
    },
    {
        id: "returns",
        title: "30-Day Returns",
        text: "Hassle-free return policy",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
            </svg>
        ),
    },
    {
        id: "auth",
        title: "Authenticity",
        text: "100% genuine AVEX product",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
    },
    {
        id: "sizing",
        title: "EU Sizing",
        text: "XS-XXL in all key styles",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12h20M12 2v20M17 7l-5-5-5 5M7 17l5 5 5-5" />
            </svg>
        ),
    },
];

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];
const TICKER_ITEMS = ["New Season Hoodies", "Free Shipping Over $120", "New Season Hoodies", "Free Shipping Over $120", "New Season Hoodies", "Free Shipping Over $120", "New Season Hoodies", "Free Shipping Over $120"];

function badgeClass(tag) {
    if (!tag) return "";
    return `hcard__badge hcard__badge--${tag.toLowerCase()}`;
}

function sortHoodies(list, key) {
    const c = [...list];
    if (key === "price-asc") return c.sort((a, b) => a.price - b.price);
    if (key === "price-desc") return c.sort((a, b) => b.price - a.price);
    if (key === "new") return c.filter(p => p.tag === "New").concat(c.filter(p => p.tag !== "New"));
    if (key === "sale") return c.filter(p => p.tag === "Sale").concat(c.filter(p => p.tag !== "Sale"));
    return c;
}

function HoodieCard({ item }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeColor, setActiveColor] = useState(0);
    const [wished, setWished] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAdd = useCallback((e) => {
        e.preventDefault();
        if (!selectedSize) return;
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    }, [selectedSize]);

    const toggleWish = useCallback((e) => {
        e.preventDefault();
        setWished(v => !v);
    }, []);

    return (
        <article className="hcard" aria-label={item.name}>
            <Link to={`/product/${item.id}`} state={{type : "hoodies"}} className="hcard__media" tabIndex={-1} aria-hidden="true">
                {item.tag && <span className={badgeClass(item.tag)}>{item.tag}</span>}
                <button
                    className={`hcard__wish${wished ? " hcard__wish--active" : ""}`}
                    onClick={toggleWish}
                    aria-label={wished ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
                    aria-pressed={wished}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
                {item.src ? (
                    <img className="hcard__img" src={item.src} alt={item.name} loading="lazy" decoding="async" />
                ) : (
                    <div className="hcard__placeholder" aria-hidden="true">
                        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 18c0 0 4-6 18-6s18 6 18 6v28H10V18z" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M10 18c0 0-6 2-6 8s6 6 6 6M46 18c0 0 6 2 6 8s-6 6-6 6" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
                            <path d="M20 12c0 0 2 4 8 4s8-4 8-4" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
                <div className="hcard__sizes-overlay" aria-label={`Select size for ${item.name}`}>
                    <span className="hcard__sizes-label">
                        {selectedSize ? `Size: ${selectedSize}` : "Select size"}
                    </span>
                    <div className="hcard__sizes-row" role="group" aria-label="Available sizes">
                        {item.sizes.map(sz => (
                            <button
                                key={sz}
                                className={`hcard__size-chip${selectedSize === sz ? " hcard__size-chip--selected" : ""}`}
                                aria-pressed={selectedSize === sz}
                                aria-label={`Size ${sz}`}
                                onClick={(e) => { e.preventDefault(); setSelectedSize(s => s === sz ? null : sz); }}
                            >
                                {sz}
                            </button>
                        ))}
                    </div>
                    <button
                        className={`hcard__add-btn${added ? " hcard__add-btn--added" : ""}`}
                        onClick={handleAdd}
                        disabled={!selectedSize}
                        aria-label={added ? "Added to cart" : selectedSize ? `Add ${item.name} in size ${selectedSize} to cart` : "Select a size first"}
                    >
                        <span>
                            {added ? (
                                <>
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                                        <path d="M1 5l3.5 4L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Added
                                </>
                            ) : (
                                <>
                                    Add to Cart
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </Link>
            <div className="hcard__body">
                <Link to={`/product/${item.id}`} state={{type : "hoodies"}} className="hcard__name">{item.name}</Link>
                <p className="hcard__desc">{item.description}</p>
                <div className="hcard__footer">
                    <div className="hcard__prices">
                        <span className={`hcard__price${item.originalPrice ? " hcard__price--sale" : ""}`}>
                            {item.price}Dh
                        </span>
                        {item.originalPrice && (
                            <span className="hcard__original">{item.originalPrice}Dh</span>
                        )}
                    </div>
                    <div className="hcard__swatches" role="group" aria-label={`Color options for ${item.name}`}>
                        {item.colors.map((c, i) => (
                            <button
                                key={c.hex}
                                className="hcard__swatch"
                                style={{ background: c.hex }}
                                aria-label={c.label}
                                aria-pressed={activeColor === i}
                                onClick={() => setActiveColor(i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function Hoodies() {
    const [sortKey, setSortKey] = useState("featured");
    const [activeSize, setActiveSize] = useState(null);
    const [activeTag, setActiveTag] = useState(null);

    const filtered = useMemo(() => {
        let list = HOODIES;
        if (activeSize) list = list.filter(p => p.sizes.includes(activeSize));
        if (activeTag) list = list.filter(p => p.tag === activeTag);
        return sortHoodies(list, sortKey);
    }, [activeSize, activeTag, sortKey]);

    const handleSizeToggle = useCallback(sz => setActiveSize(s => s === sz ? null : sz), []);
    const handleTagToggle = useCallback(tag => setActiveTag(t => t === tag ? null : tag), []);
    const handleClear = useCallback(() => { setActiveSize(null); setActiveTag(null); setSortKey("featured"); }, []);
    const hasActiveFilters = activeSize || activeTag;

    return (
        <>
            <div className="hoodies" id="hoodies">
                <header className="hoodies__hero" aria-label="Hoodies collection">
                    <div className="hoodies__hero-content">
                        <p className="hoodies__eyebrow" aria-hidden="true">SS 2026 Collection</p>
                        <h1 className="hoodies__heading">
                            The<br /><em>Hoodie</em><br />Edit
                        </h1>
                    </div>
                    <div className="hoodies__hero-meta" aria-hidden="true">
                        <div className="hoodies__hero-stat">
                            <div className="hoodies__hero-stat-num">{HOODIES.length}</div>
                            <div className="hoodies__hero-stat-label">Styles</div>
                        </div>
                        <div className="hoodies__hero-stat">
                            <div className="hoodies__hero-stat-num">3</div>
                            <div className="hoodies__hero-stat-label">New drops</div>
                        </div>
                    </div>
                    <div className="hoodies__ticker" aria-hidden="true">
                        <div className="hoodies__ticker-track">
                            {TICKER_ITEMS.map((item, i) => (
                                <span key={i} className="hoodies__ticker-item">{item}</span>
                            ))}
                        </div>
                    </div>
                </header>
                <div className="hoodies__toolbar" role="toolbar" aria-label="Filter and sort hoodies">
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                        <div className="hoodies__filter-group" role="group" aria-label="Filter by size">
                            <span className="hoodies__filter-label">Size</span>
                            {SIZE_ORDER.map(sz => (
                                <button
                                    key={sz}
                                    className="hoodies__size-btn"
                                    aria-pressed={activeSize === sz}
                                    onClick={() => handleSizeToggle(sz)}
                                    aria-label={`Filter by size ${sz}`}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>
                        <div className="hoodies__filter-group" role="group" aria-label="Filter by tag">
                            {["New", "Sale", "Bestseller", "Limited"].map(tag => (
                                <button
                                    key={tag}
                                    className="hoodies__tag-btn"
                                    aria-pressed={activeTag === tag}
                                    onClick={() => handleTagToggle(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        {hasActiveFilters && (
                            <button className="hoodies__clear" onClick={handleClear} aria-label="Clear all filters">
                                Clear all
                            </button>
                        )}
                    </div>
                    <div className="hoodies__toolbar-right">
                        <span className="hoodies__count" aria-live="polite" aria-atomic="true">
                            {filtered.length} {filtered.length === 1 ? "style" : "styles"}
                        </span>
                        <div className="hoodies__sort-wrap">
                            <select
                                className="hoodies__sort"
                                value={sortKey}
                                onChange={e => setSortKey(e.target.value)}
                                aria-label="Sort hoodies"
                            >
                                {SORT_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <main className="hoodies__body">
                    <ul className="hoodies__grid" role="list" aria-label="Hoodies collection">
                        {filtered.length > 0 ? (
                            filtered.map(item => (
                                <li key={item.id}>
                                    <HoodieCard item={item} />
                                </li>
                            ))
                        ) : (
                            <li className="hoodies__empty">
                                <span className="hoodies__empty-glyph" aria-hidden="true">0</span>
                                <p className="hoodies__empty-msg">No hoodies match your filters.</p>
                                <button className="hoodies__empty-cta" onClick={handleClear}>
                                    Clear filters
                                </button>
                            </li>
                        )}
                    </ul>
                </main>
                <div className="hoodies__feature-strip" aria-label="Service highlights" role="list">
                    {FEATURES.map(f => (
                        <div key={f.id} className="hoodies__feature-item" role="listitem">
                            <div className="hoodies__feature-icon">{f.icon}</div>
                            <div>
                                <p className="hoodies__feature-title">{f.title}</p>
                                <p className="hoodies__feature-text">{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}