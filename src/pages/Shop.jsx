import { useState, useMemo, useCallback, useId } from "react";
import '../styles/Shop.css';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ALL_PRODUCTS } from "../data/data";
const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "hoodies", label: "Hoodies" },
    { id: "jeans", label: "Jeans" },
    { id: "sneakers", label: "Sneakers" },
];

const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low" },
    { value: "price-desc", label: "Price: High" },
    { value: "new", label: "Newest" },
];

const TAG_FILTERS = ["New", "Sale", "Bestseller", "Limited"];

function badgeClass(tag) {
    if (!tag) return "";
    return `pcard__badge pcard__badge--${tag.toLowerCase()}`;
}

function sortProducts(products, sortKey) {
    const copy = [...products];
    if (sortKey === "price-asc") return copy.sort((a, b) => a.price - b.price);
    if (sortKey === "price-desc") return copy.sort((a, b) => b.price - a.price);
    if (sortKey === "new") return copy.filter((p) => p.tag === "New").concat(copy.filter((p) => p.tag !== "New"));
    return copy;
}

function ProductCard({ product, listView }) {
    const [added, setAdded] = useState(false);
    const [activeColor, setActiveColor] = useState(0);

    const handleQuickAdd = useCallback((e) => {
        e.preventDefault();
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    }, []);

    return (
        <article className="pcard" aria-label={product.name}>
            <Link to={`/product/${product.id}`} state={{ type: "all_products" }} className="pcard__media" tabIndex={-1} aria-hidden="true">
                {product.tag && (
                    <span className={badgeClass(product.tag)}>{product.tag}</span>
                )}
                {product.src ? (
                    <img className="pcard__img" src={product.src} alt={product.name} loading="lazy" decoding="async" />
                ) : (
                    <div className="pcard__placeholder">
                        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                            <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                            <circle cx="19" cy="22" r="3" stroke="#0d0d0d" strokeWidth="2" />
                        </svg>
                    </div>
                )}
                <button
                    className={`pcard__quick-add${added ? " pcard__quick-add--added" : ""}`}
                    onClick={handleQuickAdd}
                    aria-label={added ? `${product.name} added` : `Quick add ${product.name}`}
                >
                    {added ? (
                        <>
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                                <path d="M1 5l3.5 4L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Added
                        </>
                    ) : (
                        <>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                                <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                            Quick Add
                        </>
                    )}
                </button>
            </Link>
            <div className="pcard__body">
                <div>
                    <span className="pcard__cat">{product.category}</span>
                    <Link to={`/product/${product.id}`} state={{ type: "all_products" }} className="pcard__name" style={{ display: "block" }}>
                        {product.name}
                    </Link>
                </div>
                <div className="pcard__footer">
                    <div className="pcard__prices">
                        <span className={`pcard__price${product.originalPrice ? " pcard__price--sale" : ""}`}>
                            {product.price}Dh
                        </span>
                        {product.originalPrice && (
                            <span className="pcard__original">${product.originalPrice}</span>
                        )}
                    </div>
                    <div className="pcard__swatches" role="group" aria-label={`Colors for ${product.name}`}>
                        {product.colors.map((hex, i) => (
                            <button
                                key={hex}
                                className="pcard__swatch"
                                style={{ background: hex }}
                                aria-label={`Color ${i + 1}`}
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

export default function Shop() {
    const sortId = useId();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeTag, setActiveTag] = useState(null);
    const [sortKey, setSortKey] = useState("featured");
    const [listView, setListView] = useState(false);

    const filtered = useMemo(() => {
        let result = ALL_PRODUCTS;
        if (activeCategory !== "all") result = result.filter((p) => p.category === activeCategory);
        if (activeTag) result = result.filter((p) => p.tag === activeTag);
        return sortProducts(result, sortKey);
    }, [activeCategory, activeTag, sortKey]);

    const handleTagToggle = useCallback((tag) => {
        setActiveTag((prev) => (prev === tag ? null : tag));
    }, []);

    const handleReset = () => {
        setActiveCategory("all");
        setActiveTag(null);
        setSortKey("featured");
    };

    return (
        <>
            <div className="shop" id="shop">
                <header className="shop__header">
                    <div className="shop__header-inner">
                        <div>
                            <p className="shop__eyebrow" aria-hidden="true">The full collection</p>
                            <h1 className="shop__heading">
                                All <em>Styles</em>
                            </h1>
                        </div>
                        <p className="shop__result-count" aria-live="polite" aria-atomic="true">
                            {filtered.length} {filtered.length === 1 ? "product" : "products"}
                        </p>
                    </div>
                </header>
                <div className="shop__toolbar" role="toolbar" aria-label="Filter and sort products">
                    <ul className="shop__cats" role="list" aria-label="Filter by category">
                        {CATEGORIES.map(({ id, label }) => (
                            <li key={id}>
                                <button
                                    className="shop__cat-btn"
                                    aria-pressed={activeCategory === id}
                                    onClick={() => setActiveCategory(id)}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="shop__controls">
                        <ul className="shop__tags" role="list" aria-label="Filter by tag">
                            {TAG_FILTERS.map((tag) => (
                                <li key={tag}>
                                    <button
                                        className="shop__tag-btn"
                                        aria-pressed={activeTag === tag}
                                        onClick={() => handleTagToggle(tag)}
                                    >
                                        {tag}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="shop__sort-wrap">
                            <label htmlFor={sortId} className="sr-only">Sort products</label>
                            <select
                                id={sortId}
                                className="shop__sort"
                                value={sortKey}
                                onChange={(e) => setSortKey(e.target.value)}
                                aria-label="Sort products"
                            >
                                {SORT_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="shop__view-toggle" role="group" aria-label="Toggle grid or list view">
                            <button
                                className="shop__view-btn"
                                aria-pressed={!listView}
                                aria-label="Grid view"
                                onClick={() => setListView(false)}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                    <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.4" />
                                    <rect x="8" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.4" />
                                    <rect x="1" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.4" />
                                    <rect x="8" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.4" />
                                </svg>
                            </button>
                            <button
                                className="shop__view-btn"
                                aria-pressed={listView}
                                aria-label="List view"
                                onClick={() => setListView(true)}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                    <path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <main className="shop__body">
                    <ul
                        className={`shop__grid${listView ? " shop__grid--list" : ""}`}
                        role="list"
                        aria-label="Products"
                    >
                        {filtered.length > 0 ? (
                            filtered.map((product) => (
                                <li key={product.id}>
                                    <ProductCard product={product} listView={listView} />
                                </li>
                            ))
                        ) : (
                            <li className="shop__empty">
                                <span className="shop__empty-icon">0</span>
                                <p className="shop__empty-text">No products match your filters.</p>
                                <button className="shop__empty-reset" onClick={handleReset}>
                                    Clear filters
                                </button>
                            </li>
                        )}
                    </ul>
                </main>
            </div>
        </>
    );
}