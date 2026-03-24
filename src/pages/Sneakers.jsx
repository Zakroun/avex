import { useState, useMemo, useCallback, useEffect } from "react";
import '../styles/Sneakers.css';
import { SNEAKERS } from "../data/data";
import { Link } from "react-router-dom";

const STYLES = ["All", "Low-Top", "High-Top", "Mid-Top", "Runner", "Slip-On"];
const EU_SIZES = [38, 39, 40, 41, 42, 43, 44, 45];
const TAGS = ["New", "Sale", "Bestseller", "Limited"];

const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "new", label: "New Arrivals" },
    { value: "sale", label: "On Sale" },
];

const MARQUEE_ITEMS = [
    "New Season Sneakers", "Free Shipping Over $120", "New Season Sneakers",
    "Free Shipping Over $120", "New Season Sneakers", "Free Shipping Over $120",
    "New Season Sneakers", "Free Shipping Over $120",
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
        text: "38–45 in all key styles",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12h20M12 2v20M17 7l-5-5-5 5M7 17l5 5 5-5" />
            </svg>
        ),
    },
];
function sortSneakers(list, key) {
    const c = [...list];
    if (key === "price-asc") return c.sort((a, b) => a.price - b.price);
    if (key === "price-desc") return c.sort((a, b) => b.price - a.price);
    if (key === "new") return c.filter(p => p.tag === "New").concat(c.filter(p => p.tag !== "New"));
    if (key === "sale") return c.filter(p => p.tag === "Sale").concat(c.filter(p => p.tag !== "Sale"));
    return c;
}

function countByStyle(style) {
    if (style === "All") return SNEAKERS.length;
    return SNEAKERS.filter(s => s.style === style).length;
}
function SneakerCard({ item }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeColor, setActiveColor] = useState(0);
    const [wished, setWished] = useState(false);
    const [added, setAdded] = useState(false);
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
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
        <article className="scard" aria-label={item.name}>
            <Link to={`/product/${item.id}`} state={{ type: "sneakers" }} className="scard__media" tabIndex={-1} aria-hidden="true">
                {item.tag && (
                    <span className={`scard__badge scard__badge--${item.tag.toLowerCase()}`}>{item.tag}</span>
                )}
                <span className="scard__style-chip">{item.style}</span>
                <button
                    className={`scard__wish${wished ? " scard__wish--active" : ""}`}
                    onClick={toggleWish}
                    aria-label={wished ? `Remove ${item.name} from wishlist` : `Save ${item.name} to wishlist`}
                    aria-pressed={wished}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
                {item.src ? (
                    <img className="scard__img" src={item.src} alt={item.name} loading="lazy" decoding="async" />
                ) : (
                    <div className="scard__placeholder" aria-hidden="true">
                        <svg viewBox="0 0 80 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 38c0 0 10-28 36-28 20 0 30 8 34 16l2 8H4z" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M4 38h72v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8z" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M20 38c0 0 4-12 16-16M36 10c4 0 8 1 12 3" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
                <div className="scard__size-overlay">
                    <div className="scard__size-header">
                        <span className="scard__size-label">
                            {selectedSize ? `EU ${selectedSize}` : "Select EU size"}
                        </span>
                        <button className="scard__size-guide" onClick={(e) => e.preventDefault()}>
                            Size guide
                        </button>
                    </div>
                    <div className="scard__size-grid" role="group" aria-label={`EU sizes for ${item.name}`}>
                        {item.sizes.map(sz => (
                            <button
                                key={sz}
                                className={`scard__size-chip${selectedSize === sz ? " scard__size-chip--selected" : ""}`}
                                aria-pressed={selectedSize === sz}
                                aria-label={`EU ${sz}`}
                                onClick={(e) => { e.preventDefault(); setSelectedSize(s => s === sz ? null : sz); }}
                            >
                                {sz}
                            </button>
                        ))}
                    </div>
                    <button
                        className={`scard__add-btn${added ? " scard__add-btn--added" : ""}`}
                        onClick={handleAdd}
                        disabled={!selectedSize}
                        aria-label={
                            added ? "Added to cart"
                                : selectedSize ? `Add to cart — EU ${selectedSize}`
                                    : "Select a size first"
                        }
                    >
                        <span>
                            {added ? (
                                <>
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                                        <path d="M1 5l3.5 4L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Added
                                </>
                            ) : "Add to Cart"}
                        </span>
                    </button>
                </div>
            </Link>
            <div className="scard__body">
                <div className="scard__style-row">
                    <span className="scard__style-tag">{item.style}</span>
                    <span className="scard__divider" aria-hidden="true" />
                    <span className="scard__materials-tag">{item.materials}</span>
                </div>
                <Link to={`/product/${item.id}`} state={{ type: "sneakers" }} className="scard__name">{item.name}</Link>
                <div className="scard__footer">
                    <div className="scard__prices">
                        <span className={`scard__price${item.originalPrice ? " scard__price--sale" : ""}`}>
                            {item.price}Dh
                        </span>
                        {item.originalPrice && (
                            <span className="scard__original">{item.originalPrice}Dh</span>
                        )}
                    </div>
                    <div className="scard__swatches" role="group" aria-label={`Colors for ${item.name}`}>
                        {item.colors.map((c, i) => (
                            <button
                                key={c.hex}
                                className="scard__swatch"
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
export default function Sneakers() {
    const [activeStyle, setActiveStyle] = useState("All");
    const [activeSize, setActiveSize] = useState(null);
    const [activeTag, setActiveTag] = useState(null);
    const [sortKey, setSortKey] = useState("featured");

    const filtered = useMemo(() => {
        let list = SNEAKERS;
        if (activeStyle !== "All") list = list.filter(s => s.style === activeStyle);
        if (activeSize) list = list.filter(s => s.sizes.includes(activeSize));
        if (activeTag) list = list.filter(s => s.tag === activeTag);
        return sortSneakers(list, sortKey);
    }, [activeStyle, activeSize, activeTag, sortKey]);

    const handleTagToggle = useCallback(tag => setActiveTag(t => t === tag ? null : tag), []);
    const handleSizeToggle = useCallback(sz => setActiveSize(s => s === sz ? null : sz), []);

    const clearAll = useCallback(() => {
        setActiveStyle("All");
        setActiveSize(null);
        setActiveTag(null);
        setSortKey("featured");
    }, []);

    const hasFilters = activeStyle !== "All" || activeSize || activeTag;

    return (
        <>
            <div className="sneakers" id="sneakers">
                <header className="sneakers__hero" aria-label="Sneakers collection">
                    <div className="sneakers__hero-ring" aria-hidden="true" />
                    <div className="sneakers__hero-arc" aria-hidden="true" />
                    <div className="sneakers__hero-left">
                        <p className="sneakers__eyebrow" aria-hidden="true">The footwear edit</p>
                        <h1 className="sneakers__heading">
                            Step<br /><em>Into</em><br />Now
                        </h1>
                    </div>
                    <div className="sneakers__hero-right" aria-hidden="true">
                        <div className="sneakers__hero-accent">
                            <span className="sneakers__hero-accent-dot" />
                            <span className="sneakers__hero-accent-label">In Stock Now</span>
                        </div>
                        <div>
                            <div className="sneakers__hero-kpi">
                                <div className="sneakers__hero-kpi-num">{SNEAKERS.length}</div>
                                <div className="sneakers__hero-kpi-label">Styles</div>
                            </div>
                        </div>
                        <div className="sneakers__hero-kpi">
                            <div className="sneakers__hero-kpi-num">{STYLES.length - 1}</div>
                            <div className="sneakers__hero-kpi-label">Silhouettes</div>
                        </div>
                    </div>
                </header>
                <div className="sneakers__marquee" aria-hidden="true">
                    <div className="sneakers__marquee-track">
                        {MARQUEE_ITEMS.map((item, i) => (
                            <span key={i} className="sneakers__marquee-item">{item}</span>
                        ))}
                    </div>
                </div>
                <div
                    className="sneakers__tabs"
                    role="tablist"
                    aria-label="Filter by shoe style"
                >
                    {STYLES.map(style => (
                        <button
                            key={style}
                            className="sneakers__tab"
                            role="tab"
                            aria-selected={activeStyle === style}
                            onClick={() => setActiveStyle(style)}
                        >
                            {style}
                            <span className="sneakers__tab-count" aria-hidden="true">
                                {countByStyle(style)}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="sneakers__toolbar" role="toolbar" aria-label="Filter and sort sneakers">
                    <div className="sneakers__toolbar-left">
                        <div className="sneakers__sizes" role="group" aria-label="Filter by EU size">
                            {EU_SIZES.map(sz => (
                                <button
                                    key={sz}
                                    className="sneakers__size-btn"
                                    aria-pressed={activeSize === sz}
                                    aria-label={`EU size ${sz}`}
                                    onClick={() => handleSizeToggle(sz)}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>
                        <div className="sneakers__tag-pills" role="group" aria-label="Filter by collection tag">
                            {TAGS.map(tag => (
                                <button
                                    key={tag}
                                    className="sneakers__tag-pill"
                                    aria-pressed={activeTag === tag}
                                    onClick={() => handleTagToggle(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        {hasFilters && (
                            <button className="sneakers__clear-btn" onClick={clearAll} aria-label="Clear all filters">
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="sneakers__toolbar-right">
                        <span className="sneakers__count" aria-live="polite" aria-atomic="true">
                            {filtered.length} {filtered.length === 1 ? "style" : "styles"}
                        </span>
                        <div className="sneakers__sort-wrap">
                            <select
                                className="sneakers__sort"
                                value={sortKey}
                                onChange={e => setSortKey(e.target.value)}
                                aria-label="Sort sneakers"
                            >
                                {SORT_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <main className="sneakers__body">
                    <ul className="sneakers__grid" role="list" aria-label="Sneakers collection">
                        {filtered.length > 0 ? (
                            filtered.map(item => (
                                <li key={item.id}>
                                    <SneakerCard item={item} />
                                </li>
                            ))
                        ) : (
                            <li className="sneakers__empty">
                                <span className="sneakers__empty-glyph" aria-hidden="true">0</span>
                                <p className="sneakers__empty-msg">No sneakers match your filters.</p>
                                <button className="sneakers__empty-cta" onClick={clearAll}>
                                    Clear filters
                                </button>
                            </li>
                        )}
                    </ul>
                </main>
                <div className="sneakers__feature-strip" aria-label="Service highlights" role="list">
                    {FEATURES.map(f => (
                        <div key={f.id} className="sneakers__feature-item" role="listitem">
                            <div className="sneakers__feature-icon">{f.icon}</div>
                            <div>
                                <p className="sneakers__feature-title">{f.title}</p>
                                <p className="sneakers__feature-text">{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}