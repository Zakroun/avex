import { useState, useMemo, useCallback } from "react";
import { useEffect } from "react";
import '../styles/Jeans.css';
import { JEANS } from "../data/data";
import { Link } from "react-router-dom";

const FITS = ["All", "Slim", "Straight", "Relaxed", "Wide"];
const RISES = ["All", "Low", "Mid", "High"];
const WAISTS = ["28", "30", "32", "34", "36", "38"];
const TAGS = ["New", "Sale", "Limited"];

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
        text: "On all orders over 1,200 Dh",
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
        text: "28-38 in all key styles",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12h20M12 2v20M17 7l-5-5-5 5M7 17l5 5 5-5" />
            </svg>
        ),
    },
];

function sortJeans(list, key) {
    const c = [...list];
    if (key === "price-asc") return c.sort((a, b) => a.price - b.price);
    if (key === "price-desc") return c.sort((a, b) => b.price - a.price);
    if (key === "new") return c.filter(p => p.tag === "New").concat(c.filter(p => p.tag !== "New"));
    if (key === "sale") return c.filter(p => p.tag === "Sale").concat(c.filter(p => p.tag !== "Sale"));
    return c;
}

function JeanCard({ item }) {
    const [selectedWaist, setSelectedWaist] = useState(null);
    const [activeColor, setActiveColor] = useState(0);
    const [added, setAdded] = useState(false);

    const handleAdd = useCallback((e) => {
        e.preventDefault();
        if (!selectedWaist) return;
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    }, [selectedWaist]);

    return (
        <article className="jcard" aria-label={item.name}>
            <Link to={`/product/${item.id}`} state={{ type: "jeans" }} className="jcard__media" tabIndex={-1} aria-hidden="true">
                {item.tag && (
                    <span className={`jcard__badge jcard__badge--${item.tag.toLowerCase()}`}>{item.tag}</span>
                )}
                <span className="jcard__fit-chip">{item.fit}</span>
                {item.src ? (
                    <img className="jcard__img" src={item.src} alt={item.name} loading="lazy" decoding="async" />
                ) : (
                    <div className="jcard__placeholder" aria-hidden="true">
                        <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 4h32l4 20-8 2v34H24V36h-0V60H12V26L4 24 8 4z" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M16 4c0 6 4 10 8 10s8-4 8-10" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
                <div className="jcard__waist-overlay">
                    <span className="jcard__waist-label">
                        {selectedWaist ? `Waist: ${selectedWaist}"` : "Select waist"}
                    </span>
                    <div className="jcard__waist-row" role="group" aria-label="Select waist size">
                        {item.sizes.map(sz => (
                            <button
                                key={sz}
                                className={`jcard__waist-chip${selectedWaist === sz ? " jcard__waist-chip--selected" : ""}`}
                                aria-pressed={selectedWaist === sz}
                                aria-label={`Waist ${sz}`}
                                onClick={(e) => { e.preventDefault(); setSelectedWaist(s => s === sz ? null : sz); }}
                            >
                                {sz}
                            </button>
                        ))}
                    </div>
                    <button
                        className={`jcard__cart-btn${added ? " jcard__cart-btn--added" : ""}`}
                        onClick={handleAdd}
                        disabled={!selectedWaist}
                        aria-label={added ? "Added to cart" : selectedWaist ? `Add to cart — waist ${selectedWaist}` : "Select a size first"}
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
            <div className="jcard__body">
                <div className="jcard__meta-row">
                    <span className="jcard__fit-label">{item.fit}</span>
                    <span className="jcard__rise-dot" aria-hidden="true" />
                    <span className="jcard__rise-label">{item.rise} Rise</span>
                </div>
                <Link to={`/product/${item.id}`} state={{ type: "jeans" }} className="jcard__name">{item.name}</Link>
                <p className="jcard__desc">{item.description}</p>
                <div className="jcard__footer">
                    <div className="jcard__prices">
                        <span className={`jcard__price${item.originalPrice ? " jcard__price--sale" : ""}`}>
                            {item.price} Dh
                        </span>
                        {item.originalPrice && (
                            <span className="jcard__original">{item.originalPrice} Dh</span>
                        )}
                    </div>
                    <div className="jcard__swatches" role="group" aria-label={`Color options for ${item.name}`}>
                        {item.colors.map((c, i) => (
                            <button
                                key={c.hex}
                                className="jcard__swatch"
                                style={{ backgroundColor: c.hex }}
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

export default function Jeans() {
    const [activeFit, setActiveFit] = useState("All");
    const [activeRise, setActiveRise] = useState("All");
    const [activeWaist, setActiveWaist] = useState(null);
    const [activeTags, setActiveTags] = useState([]);
    const [maxPrice, setMaxPrice] = useState(499);
    const [sortKey, setSortKey] = useState("featured");

    const priceRange = useMemo(() => {
        const prices = JEANS.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }, []);
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
    const filtered = useMemo(() => {
        let list = JEANS;
        if (activeFit !== "All") list = list.filter(p => p.fit === activeFit);
        if (activeRise !== "All") list = list.filter(p => p.rise === activeRise);
        if (activeWaist) list = list.filter(p => p.sizes.includes(activeWaist));
        if (activeTags.length) list = list.filter(p => p.tag && activeTags.includes(p.tag));
        list = list.filter(p => p.price <= maxPrice);
        return sortJeans(list, sortKey);
    }, [activeFit, activeRise, activeWaist, activeTags, maxPrice, sortKey]);

    const toggleTag = useCallback((tag) => {
        setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    }, []);

    const clearAll = useCallback(() => {
        setActiveFit("All");
        setActiveRise("All");
        setActiveWaist(null);
        setActiveTags([]);
        setMaxPrice(priceRange.max);
        setSortKey("featured");
    }, [priceRange.max]);

    const activePills = useMemo(() => {
        const pills = [];
        if (activeFit !== "All") pills.push({ key: "fit", label: activeFit, onRemove: () => setActiveFit("All") });
        if (activeRise !== "All") pills.push({ key: "rise", label: `${activeRise} Rise`, onRemove: () => setActiveRise("All") });
        if (activeWaist) pills.push({ key: "waist", label: `Waist ${activeWaist}`, onRemove: () => setActiveWaist(null) });
        activeTags.forEach(t => pills.push({ key: `tag-${t}`, label: t, onRemove: () => toggleTag(t) }));
        if (maxPrice < priceRange.max) pills.push({ key: "price", label: `Up to ${maxPrice} Dh`, onRemove: () => setMaxPrice(priceRange.max) });
        return pills;
    }, [activeFit, activeRise, activeWaist, activeTags, maxPrice, priceRange.max, toggleTag]);

    const fillLeft = ((priceRange.min / priceRange.max) * 100).toFixed(1);
    const fillRight = (100 - (maxPrice / priceRange.max) * 100).toFixed(1);

    return (
        <>
            <div className="jeans" id="jeans">
                <header className="jeans__hero" aria-label="Jeans collection">
                    <div className="jeans__hero-left">
                        <p className="jeans__eyebrow" aria-hidden="true">The denim edit</p>
                        <h1 className="jeans__heading">
                            Wear<br /><em>The</em><br />Street
                        </h1>
                        <div className="jeans__hero-tags" aria-hidden="true">
                            <span className="jeans__hero-tag jeans__hero-tag--accent">SS 2026</span>
                            {FITS.filter(f => f !== "All").map(f => (
                                <span key={f} className="jeans__hero-tag">{f}</span>
                            ))}
                        </div>
                    </div>
                    <div className="jeans__hero-right" aria-hidden="true">
                        <div className="jeans__hero-stat-row">
                            <div className="jeans__hero-stat">
                                <div className="jeans__hero-stat-num">{JEANS.length}</div>
                                <div className="jeans__hero-stat-label">Styles</div>
                            </div>
                            <div className="jeans__hero-stat">
                                <div className="jeans__hero-stat-num">{FITS.length - 1}</div>
                                <div className="jeans__hero-stat-label">Fits</div>
                            </div>
                            <div className="jeans__hero-stat">
                                <div className="jeans__hero-stat-num">{WAISTS.length}</div>
                                <div className="jeans__hero-stat-label">Waist sizes</div>
                            </div>
                        </div>
                    </div>
                    <div className="jeans__stitch" aria-hidden="true" />
                </header>
                <div className="jeans__layout">
                    <aside className="jeans__sidebar" aria-label="Filter products">
                        <div className="jeans__sidebar-heading">
                            Filters
                            {activePills.length > 0 && (
                                <button className="jeans__sidebar-clear" onClick={clearAll}>Clear all</button>
                            )}
                        </div>
                        <div className="jeans__filter-section">
                            <p className="jeans__filter-title">Fit</p>
                            <ul className="jeans__fit-list" role="list">
                                {FITS.map(fit => (
                                    <li key={fit}>
                                        <button
                                            className="jeans__fit-btn"
                                            aria-pressed={activeFit === fit}
                                            onClick={() => setActiveFit(fit)}
                                        >
                                            {fit}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="jeans__filter-section">
                            <p className="jeans__filter-title">Rise</p>
                            <div className="jeans__rise-row" role="group" aria-label="Filter by rise">
                                {RISES.map(rise => (
                                    <button
                                        key={rise}
                                        className="jeans__rise-btn"
                                        aria-pressed={activeRise === rise}
                                        onClick={() => setActiveRise(rise)}
                                    >
                                        {rise}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="jeans__filter-section">
                            <p className="jeans__filter-title">Waist</p>
                            <div className="jeans__waist-grid" role="group" aria-label="Filter by waist size">
                                {WAISTS.map(w => (
                                    <button
                                        key={w}
                                        className="jeans__waist-btn"
                                        aria-pressed={activeWaist === w}
                                        onClick={() => setActiveWaist(v => v === w ? null : w)}
                                        aria-label={`Waist ${w}`}
                                    >
                                        {w}"
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="jeans__filter-section">
                            <p className="jeans__filter-title">Max Price</p>
                            <div className="jeans__price-range">
                                <span>From <strong>{priceRange.min} Dh</strong></span>
                                <span>Up to <strong>{maxPrice} Dh</strong></span>
                            </div>
                            <div className="jeans__range-track" aria-hidden="true">
                                <div
                                    className="jeans__range-fill"
                                    style={{ left: `${fillLeft}%`, right: `${fillRight}%` }}
                                />
                            </div>
                            <input
                                type="range"
                                className="jeans__range-input"
                                min={priceRange.min}
                                max={priceRange.max}
                                step={10}
                                value={maxPrice}
                                onChange={e => setMaxPrice(Number(e.target.value))}
                                aria-label="Maximum price filter"
                                style={{ position: "relative", width: "100%", marginTop: "0.25rem" }}
                            />
                        </div>
                        <div className="jeans__filter-section">
                            <p className="jeans__filter-title">Collection</p>
                            <ul className="jeans__tag-list" role="list">
                                {TAGS.map(tag => (
                                    <li key={tag}>
                                        <button
                                            className="jeans__tag-check"
                                            role="checkbox"
                                            aria-checked={activeTags.includes(tag)}
                                            onClick={() => toggleTag(tag)}
                                        >
                                            <span className="jeans__tag-box" aria-hidden="true" />
                                            <span className="jeans__tag-label">{tag}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                    <div className="jeans__main">
                        <div className="jeans__topbar" role="toolbar" aria-label="Active filters and sort">
                            <div className="jeans__topbar-left">
                                {activePills.length > 0 && (
                                    <div className="jeans__active-filters" aria-label="Active filters">
                                        {activePills.map(pill => (
                                            <span key={pill.key} className="jeans__active-pill">
                                                {pill.label}
                                                <button
                                                    className="jeans__active-pill-remove"
                                                    onClick={pill.onRemove}
                                                    aria-label={`Remove ${pill.label} filter`}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <span className="jeans__result-count" aria-live="polite" aria-atomic="true">
                                    {filtered.length} {filtered.length === 1 ? "style" : "styles"}
                                </span>
                            </div>
                            <div className="jeans__sort-wrap">
                                <select
                                    className="jeans__sort"
                                    value={sortKey}
                                    onChange={e => setSortKey(e.target.value)}
                                    aria-label="Sort jeans"
                                >
                                    {SORT_OPTIONS.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <ul className="jeans__grid" role="list" aria-label="Jeans collection">
                            {filtered.length > 0 ? (
                                filtered.map(item => (
                                    <li key={item.id}>
                                        <JeanCard item={item} />
                                    </li>
                                ))
                            ) : (
                                <li className="jeans__empty">
                                    <span className="jeans__empty-glyph" aria-hidden="true">0</span>
                                    <p className="jeans__empty-msg">No styles match your filters.</p>
                                    <button className="jeans__empty-cta" onClick={clearAll}>
                                        Clear all filters
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="jeans__feature-strip" aria-label="Service highlights" role="list">
                    {FEATURES.map(f => (
                        <div key={f.id} className="jeans__feature-item" role="listitem">
                            <div className="jeans__feature-icon">{f.icon}</div>
                            <div>
                                <p className="jeans__feature-title">{f.title}</p>
                                <p className="jeans__feature-text">{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}