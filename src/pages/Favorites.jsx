import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import '../styles/Favorites.css';
const fmt = (n) => `$${Number(n).toFixed(2).replace(/\.00$/, "")}`;

const CATEGORY_LABELS = {
    hoodies: "Hoodies",
    jeans: "Jeans",
    sneakers: "Sneakers",
    featuredProducts: "Featured",
};

const SORT_OPTIONS = [
    { value: "saved", label: "Recently Saved" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "name", label: "Name A → Z" },
];

function sortItems(list, key) {
    const c = [...list];
    if (key === "price-asc") return c.sort((a, b) => a.price - b.price);
    if (key === "price-desc") return c.sort((a, b) => b.price - a.price);
    if (key === "name") return c.sort((a, b) => a.name.localeCompare(b.name));
    return c;
}
function FavCard({ item, onRemove, onAddToCart }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [added, setAdded] = useState(false);

    const handleAdd = useCallback((e) => {
        e.preventDefault();
        if (!selectedSize && item.sizes?.length) return;
        setAdded(true);
        onAddToCart(item);
        setTimeout(() => setAdded(false), 1800);
    }, [selectedSize, item, onAddToCart]);

    const hasSizes = item.sizes?.length > 0;

    return (
        <article className="fcard" aria-label={item.name}>
            <a href={`/product/${item.id}`} className="fcard__media" tabIndex={-1} aria-hidden="true">
                {item.tag && (
                    <span className={`fcard__badge fcard__badge--${item.tag.toLowerCase()}`}>{item.tag}</span>
                )}
                <button
                    className="fcard__remove"
                    onClick={(e) => { e.preventDefault(); onRemove(item.id, item.type); }}
                    aria-label={`Remove ${item.name} from favorites`}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
                {item.src ? (
                    <img className="fcard__img" src={item.src} alt={item.name} loading="lazy" decoding="async" />
                ) : (
                    <div className="fcard__placeholder" aria-hidden="true">
                        <svg viewBox="0 0 56 56" fill="none">
                            <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                            <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
                {hasSizes && (
                    <div className="fcard__size-overlay">
                        <span className="fcard__size-label">
                            {selectedSize ? `Size: ${selectedSize}` : "Select size"}
                        </span>
                        <div className="fcard__size-chips" role="group" aria-label={`Sizes for ${item.name}`}>
                            {item.sizes.map(sz => (
                                <button
                                    key={sz}
                                    className={`fcard__size-chip${selectedSize === sz ? " fcard__size-chip--selected" : ""}`}
                                    aria-pressed={selectedSize === sz}
                                    onClick={(e) => { e.preventDefault(); setSelectedSize(s => s === sz ? null : sz); }}
                                    aria-label={`Size ${sz}`}
                                >{sz}</button>
                            ))}
                        </div>
                        <button
                            className={`fcard__add-btn${added ? " fcard__add-btn--added" : ""}`}
                            onClick={handleAdd}
                            disabled={hasSizes && !selectedSize}
                            aria-label={added ? "Added to cart" : "Add to cart"}
                        >
                            <span>
                                {added ? (
                                    <><svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true"><path d="M1 4.5l3 3.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Added</>
                                ) : "Add to Cart"}
                            </span>
                        </button>
                    </div>
                )}
                {!hasSizes && (
                    <div className="fcard__size-overlay">
                        <button
                            className={`fcard__add-btn${added ? " fcard__add-btn--added" : ""}`}
                            onClick={handleAdd}
                            aria-label={added ? "Added to cart" : "Add to cart"}
                        >
                            <span>
                                {added ? (
                                    <><svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true"><path d="M1 4.5l3 3.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Added</>
                                ) : "Add to Cart"}
                            </span>
                        </button>
                    </div>
                )}
            </a>
            <div className="fcard__body">
                <p className="fcard__category">{CATEGORY_LABELS[item.type] || item.type}</p>
                <a href={`/product/${item.id}`} className="fcard__name">{item.name}</a>
                <div className="fcard__footer">
                    <div className="fcard__prices">
                        <span className={`fcard__price${item.originalPrice ? " fcard__price--sale" : ""}`}>
                            {fmt(item.price)}
                        </span>
                        {item.originalPrice && (
                            <span className="fcard__original">{fmt(item.originalPrice)}</span>
                        )}
                    </div>
                    {item.colors?.length > 0 && (
                        <div className="fcard__swatches" aria-hidden="true">
                            {item.colors.slice(0, 3).map(c => (
                                <span key={c.hex} className="fcard__swatch" style={{ background: c.hex }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
function FavCardList({ item, onRemove, onAddToCart }) {
    const [added, setAdded] = useState(false);

    const handleAdd = useCallback(() => {
        setAdded(true);
        onAddToCart(item);
        setTimeout(() => setAdded(false), 1800);
    }, [item, onAddToCart]);

    return (
        <article className="fcard fcard--list" aria-label={item.name}>
            <a href={`/product/${item.id}`} className="fcard__media" tabIndex={-1} aria-hidden="true">
                {item.src ? (
                    <img className="fcard__img" src={item.src} alt={item.name} loading="lazy" />
                ) : (
                    <div className="fcard__placeholder" aria-hidden="true">
                        <svg viewBox="0 0 56 56" fill="none">
                            <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                            <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
            </a>
            <div className="fcard__body">
                <div className="fcard__info">
                    <p className="fcard__category">{CATEGORY_LABELS[item.type] || item.type}</p>
                    <a href={`/product/${item.id}`} className="fcard__name" style={{ fontSize: "0.95rem" }}>{item.name}</a>
                    {item.colors?.length > 0 && (
                        <div className="fcard__swatches" style={{ marginTop: "0.4rem" }} aria-hidden="true">
                            {item.colors.slice(0, 4).map(c => (
                                <span key={c.hex} className="fcard__swatch" style={{ background: c.hex }} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="fcard__footer" style={{ gap: "0.75rem" }}>
                    <div className="fcard__prices">
                        <span className={`fcard__price${item.originalPrice ? " fcard__price--sale" : ""}`} style={{ fontSize: "1.5rem" }}>
                            {fmt(item.price)}
                        </span>
                        {item.originalPrice && (
                            <span className="fcard__original">{fmt(item.originalPrice)}</span>
                        )}
                    </div>
                    <button
                        className={`fcard__list-add${added ? " fcard__list-add--added" : ""}`}
                        onClick={handleAdd}
                        aria-label={added ? "Added to cart" : `Add ${item.name} to cart`}
                    >
                        <span>
                            {added ? (
                                <><svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true"><path d="M1 4.5l3 3.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Added</>
                            ) : (
                                <><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>Add to Cart</>
                            )}
                        </span>
                    </button>
                    <button
                        className="fcard__remove"
                        onClick={() => onRemove(item.id, item.type)}
                        aria-label={`Remove ${item.name} from favorites`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function Favorites() {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.avex.favorites ?? []);
    const [activeTab, setActiveTab] = useState("all");
    const [sortKey, setSortKey] = useState("saved");
    const [listView, setListView] = useState(false);
    const [toast, setToast] = useState({ visible: false, msg: "" });
    const [copyConfirm, setCopyConfirm] = useState(false);
    const tabs = useMemo(() => {
        const counts = { all: favorites.length };
        favorites.forEach(item => {
            const k = item.type || "other";
            counts[k] = (counts[k] || 0) + 1;
        });
        return counts;
    }, [favorites]);

    const filtered = useMemo(() => {
        const base = activeTab === "all" ? favorites : favorites.filter(i => i.type === activeTab);
        return sortItems(base, sortKey);
    }, [favorites, activeTab, sortKey]);
    const showToast = useCallback((msg) => {
        setToast({ visible: true, msg });
        setTimeout(() => setToast({ visible: false, msg: "" }), 2800);
    }, []);

    const handleRemove = useCallback((id, type) => {
        dispatch({ type: "avex/removeFromFavorites", payload: { id, type } });
        showToast("Removed from favorites");
    }, [dispatch, showToast]);

    const handleClearAll = useCallback(() => {
        dispatch({ type: "avex/clearFavorites" });
        showToast("All favorites cleared");
    }, [dispatch, showToast]);

    const handleAddToCart = useCallback((item) => {
        dispatch({ type: "avex/addToCart", payload: item });
        showToast(`${item.name} added to cart`);
    }, [dispatch, showToast]);

    const handleCopyLink = useCallback(() => {
        navigator.clipboard?.writeText(window.location.href).catch(() => { });
        setCopyConfirm(true);
        setTimeout(() => setCopyConfirm(false), 2000);
    }, []);

    const availableTabs = useMemo(() => {
        const knownTypes = [...new Set(favorites.map(i => i.type).filter(Boolean))];
        return knownTypes;
    }, [favorites]);

    return (
        <>
            <div className="fav" id="favorites">
                <header className="fav__header" aria-label="Favorites">
                    <div className="fav__header-left">
                        <p className="fav__eyebrow" aria-hidden="true">Your collection</p>
                        <h1 className="fav__heading">
                            My<br /><em>Saves</em>
                        </h1>
                    </div>
                    <div className="fav__header-right" aria-hidden="true">
                        <span className="fav__count-num">{favorites.length}</span>
                        <span className="fav__count-label">{favorites.length === 1 ? "item" : "items"} saved</span>
                    </div>
                    <div className="fav__header-stitch" aria-hidden="true" />
                </header>

                {favorites.length > 0 && (
                    <>
                        <div className="fav__toolbar" role="toolbar" aria-label="Filter and sort favorites">
                            <div className="fav__toolbar-left">
                                <div className="fav__tabs" role="group" aria-label="Filter by category">
                                    <button
                                        className="fav__tab"
                                        aria-pressed={activeTab === "all"}
                                        onClick={() => setActiveTab("all")}
                                    >
                                        All
                                        <span className="fav__tab-badge" aria-label={`${tabs.all} items`}>{tabs.all}</span>
                                    </button>
                                    {availableTabs.map(type => (
                                        <button
                                            key={type}
                                            className="fav__tab"
                                            aria-pressed={activeTab === type}
                                            onClick={() => setActiveTab(type)}
                                        >
                                            {CATEGORY_LABELS[type] || type}
                                            <span className="fav__tab-badge" aria-label={`${tabs[type]} items`}>{tabs[type]}</span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="fav__clear-all"
                                    onClick={handleClearAll}
                                    aria-label="Clear all favorites"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="fav__toolbar-right">
                                <div className="fav__sort-wrap">
                                    <select
                                        className="fav__sort"
                                        value={sortKey}
                                        onChange={e => setSortKey(e.target.value)}
                                        aria-label="Sort favorites"
                                    >
                                        {SORT_OPTIONS.map(({ value, label }) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="fav__view-toggle" role="group" aria-label="Toggle view">
                                    <button
                                        className="fav__view-btn"
                                        aria-pressed={!listView}
                                        aria-label="Grid view"
                                        onClick={() => setListView(false)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                            <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.3" />
                                            <rect x="8" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.3" />
                                            <rect x="1" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.3" />
                                            <rect x="8" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.3" />
                                        </svg>
                                    </button>
                                    <button
                                        className="fav__view-btn"
                                        aria-pressed={listView}
                                        aria-label="List view"
                                        onClick={() => setListView(true)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                            <path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <main className="fav__body">
                            <ul
                                className={`fav__grid${listView ? " fav__grid--list" : ""}`}
                                role="list"
                                aria-label={`${filtered.length} saved item${filtered.length !== 1 ? "s" : ""}`}
                                aria-live="polite"
                                aria-atomic="false"
                            >
                                {filtered.map(item => (
                                    <li key={`${item.type}-${item.id}`}>
                                        {listView ? (
                                            <FavCardList
                                                item={item}
                                                onRemove={handleRemove}
                                                onAddToCart={handleAddToCart}
                                            />
                                        ) : (
                                            <FavCard
                                                item={item}
                                                onRemove={handleRemove}
                                                onAddToCart={handleAddToCart}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </main>
                        <div className="fav__share-strip" aria-label="Share your favorites">
                            <span className="fav__share-label">Share your picks</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span
                                    className={`fav__share-copy-confirm${copyConfirm ? " fav__share-copy-confirm--visible" : ""}`}
                                    aria-live="polite"
                                >
                                    Link copied!
                                </span>
                                <div className="fav__share-actions" aria-label="Share options">
                                    <button className="fav__share-btn" onClick={handleCopyLink} aria-label="Copy link">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                    </button>
                                    <button className="fav__share-btn" aria-label="Share on Instagram">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="2" y="2" width="20" height="20" rx="5" />
                                            <circle cx="12" cy="12" r="4" />
                                            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                                        </svg>
                                    </button>
                                    <button className="fav__share-btn" aria-label="Share on X">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L2.25 2.25h6.863l4.258 5.629 4.873-5.629Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {favorites.length === 0 && (
                    <div className="fav__empty" role="status" aria-label="No favorites saved">
                        <div className="fav__empty-heart" aria-hidden="true">
                            <svg width="28" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <h2 className="fav__empty-title">
                            Nothing<br /><em>Saved</em>
                        </h2>
                        <p className="fav__empty-text">
                            Tap the heart icon on any product to save it here for later.
                        </p>
                        <a href="/shop" className="fav__empty-cta">
                            <span>Explore the shop</span>
                        </a>
                    </div>
                )}
                <div
                    className={`fav__toast${toast.visible ? " fav__toast--visible" : ""}`}
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
                        <path d="M1 5.5l4 4.5L12 1" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {toast.msg}
                </div>
            </div>
        </>
    );
}